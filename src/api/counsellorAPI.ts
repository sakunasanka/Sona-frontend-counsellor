import { apiClient, ApiResponse } from './apiBase';

// Types for dashboard data
export interface DashboardStats {
  totalSessions: number;
  upcomingSessions: number;
  totalClients: number;
  averageRating: number;
  monthlyEarnings: number;
  totalBlogs: number;
  sessionCompletionRate: number;
  clientSatisfaction: number;
  averageResponseTime: string;
  responseTimeHours?: number;
}

export interface User {
  id: number;
  name: string;
  avatar: string | null;
}

export interface Session {
  id: number;
  userId: number;
  counselorId: number;
  date: string;
  timeSlot: string;
  duration: number;
  price: number;
  notes: string | null;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  createdAt: string;
  updatedAt: string;
  user: User;
  isStudent: boolean;
}

export interface Client {
  id: number;
  name: string;
  avatar: string;
  student_id: string;
  is_anonymous: boolean;
  concerns: string[]; // Add concerns property
  status: 'active' | 'inactive' | 'new';
  last_session: string | null;
  total_sessions: number;
  next_appointment: string | null;
  progress_status: 'starting' | 'improving' | 'stable' | 'concerning';
}

// Extended client interface for detailed view
export interface MoodEntry {
  id: string;
  user_id: string;
  local_date: string;
  valence: string;
  arousal: string;
  intensity: string;
  mood: string;
  created_at: string;
  updated_at: string;
}

export interface MoodAnalysisResponse {
  totalEntries: number;
  moodDistribution: Record<string, number>;
  recentMoods: MoodEntry[];
  moodTrends: MoodEntry[];
  averageMoodScore: number;
  averageValence: number;
  averageArousal: number;
  averageIntensity: number;
  lastUpdated: string | null;
}

// PHQ-9 Questionnaire Types
export interface PHQ9Response {
  answer: number;
  questionIndex: number;
}

export interface PHQ9Entry {
  id: string;
  questionnaireType: string;
  responses: PHQ9Response[];
  totalScore: number;
  severity: string;
  impact: string;
  hasItem9Positive: boolean;
  completedAt: string;
  createdAt: string;
}

export interface PHQ9AnalysisResponse {
  totalEntries: number;
  averageScore: number;
  currentSeverity: string | null;
  severityTrend: 'improving' | 'worsening' | 'stable' | 'insufficient_data';
  recentEntries: PHQ9Entry[];
  severityDistribution: Record<string, number>;
  scoreHistory: Array<{ date: string; score: number; severity: string }>;
  lastUpdated: string | null;
  hasRiskIndicators: boolean;
}

export interface ClientDetails extends Client {
  email?: string;
  phone?: string;
  age?: number;
  gender?: string;
  address?: string;
  is_verified: boolean;
  join_date: string;
  institution?: string;
  program?: string;
  year?: string;
  referred_by?: string;
  concerns: string[];
  emergency_contact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  preferences?: {
    session_type: string;
    preferred_time: string;
    language: string;
    notifications: boolean;
  };
  notes: ClientNote[];
  sessions: ClientSession[];
  earnings?: number;
  analytics: {
    attendance_rate: number;
    average_rating: number | null;
    mood_trend: string;
    session_completion_rate: number;
  };
}

export interface ClientNote {
  id: number;
  content: string;
  created_at: string;
  created_by: string;
  is_private: boolean;
  is_deleted: boolean;
  counselor_id: number;
}

export interface ClientSession {
  id: number;
  date: string;
  duration: number;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  concerns: string[];
  notes: string;
  rating?: number;
  price?: number;
}

export interface ClientsResponse {
  clients: Client[];
  pagination: {
    current_page: number;
    total: number;
    total_pages: number;
  };
  stats: {
    total_clients: number;
    active_clients: number;
    new_clients: number;
  };
}

export interface Blog {
  id: string;
  content: string;
  excerpt: string;
  publishedDate: string;
  views: number;
  status: 'published' | 'draft';
}

export interface Activity {
  id: number;
  type: 'message' | 'session' | 'rating' | 'blog' | 'payment';
  description: string;
  timestamp: string;
  icon: string;
}

export interface PerformanceMetrics {
  sessionCompletionRate: number;
  clientSatisfaction: number;
  averageResponseTime: string; // e.g., "2 hours"
  responseTimeHours: number; // for progress bar calculation
}

// API Functions

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const response: ApiResponse<DashboardStats> = await apiClient.get('/counselors/dashboard/stats', undefined, undefined, true);
    
    console.log('Dashboard stats API response:', response);
    
    if (response.success && response.data) {
      console.log('Dashboard stats data:', response.data);
      // The API returns { success: true, message: "...", data: { ... } }
      // So response.data is the wrapped response, we need response.data.data
      const dashboardData = (response.data as any).data || response.data;
      console.log('Extracted dashboard data:', dashboardData);
      return dashboardData;
    }
    
    throw new Error('Failed to fetch dashboard stats');
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    throw error;
  }
};

/**
 * Get recent sessions
 */
export const getRecentSessions = async (counselorId: number, limit: number = 10): Promise<Session[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{data: Session[]}> = await apiClient.get(`/sessions/counselor/${counselorId}`, undefined, token, true);
    
    if (response.success && response.data) {
      // Sort by date and limit the results to get recent sessions
      const sessions = response.data.data || [];
      const recentSessions = sessions
        .sort((a, b) => new Date(b.date + (b.date.includes('T') ? '' : 'T00:00:00')).getTime() - new Date(a.date + (a.date.includes('T') ? '' : 'T00:00:00')).getTime())
        .slice(0, limit);
      
      return recentSessions;
    }
    
    throw new Error('Failed to fetch recent sessions');
  } catch (error) {
    console.error('Get recent sessions error:', error);
    throw error;
  }
};

/**
 * Get all sessions with optional filtering
 */
export const getSessions = async (counselorId: number, params?: { 
  status?: string; 
  startDate?: string; 
  endDate?: string; 
  limit?: number; 
  offset?: number;
}): Promise<Session[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{data: Session[]}> = await apiClient.get(`/sessions/counselor/${counselorId}`, undefined, token, true);
    
    if (response.success && response.data) {
      let sessions = response.data.data || [];
      
      // Apply filtering if params are provided
      if (params) {
        if (params.status) {
          sessions = sessions.filter(session => session.status === params.status);
        }
        if (params.startDate && params.endDate) {
          const startDate = new Date(params.startDate + (params.startDate.includes('T') ? '' : 'T00:00:00'));
          const endDate = new Date(params.endDate + (params.endDate.includes('T') ? '' : 'T00:00:00'));
          sessions = sessions.filter(session => {
            const sessionDate = new Date(session.date + (session.date.includes('T') ? '' : 'T00:00:00'));
            return sessionDate >= startDate && sessionDate <= endDate;
          });
        }
        if (params.limit) {
          sessions = sessions.slice(params.offset || 0, (params.offset || 0) + params.limit);
        }
      }
      
      return sessions;
    }
    
    throw new Error('Failed to fetch sessions');
  } catch (error) {
    console.error('Get sessions error:', error);
    throw error;
  }
};

/**
 * Get clients list
 */
export const getClients = async (params?: { 
  page?: number;
  limit?: number;
  search?: string;
  filter?: string;
  sort?: string;
}): Promise<{ success: boolean; data: ClientsResponse }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ data: ClientsResponse }> = await apiClient.get('/counsellor/clients', params as Record<string, unknown>, token, true);
    
    console.log('Get clients response:', response);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data
      };
    }
    
    throw new Error('Failed to fetch clients');
  } catch (error) {
    console.error('Get clients error:', error);
    throw error;
  }
};

/**
 * Get individual client details with notes and sessions
 */
export const getClientDetails = async (clientId: string): Promise<{ success: boolean; data: ClientDetails }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ data: ClientDetails }> = await apiClient.get(`/counsellor/clients/${clientId}`, undefined, token, true);
    
    console.log('Get client details response:', response);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data
      };
    }
    
    throw new Error('Failed to fetch client details');
  } catch (error) {
    console.error('Get client details error:', error);
    throw error;
  }
};

/**
 * Get mood analysis for a client with optional month filtering
 */
export const getClientMoodAnalysis = async (clientId: string, month?: number, year?: number): Promise<MoodAnalysisResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Build query parameters for month/year filtering
    const params: Record<string, string> = {};
    if (month !== undefined) params.month = month.toString();
    if (year !== undefined) params.year = year.toString();

    const response: ApiResponse<any> = await apiClient.get(`/users/${clientId}/moods`, params, token, true);
    
    console.log('Get client mood analysis response:', response);
    console.log('Response data type:', typeof response.data);
    console.log('Response data structure:', JSON.stringify(response.data, null, 2));
    
    if (response.success && response.data) {
      // Handle different response structures
      let moods: MoodEntry[] = [];
      
      // The API might return data directly as an array or wrapped in an object
      if (Array.isArray(response.data)) {
        moods = response.data;
      } else if (response.data && typeof response.data === 'object') {
        // Check common response patterns
        if (Array.isArray(response.data.data)) {
          moods = response.data.data;
        } else if (Array.isArray(response.data.moods)) {
          moods = response.data.moods;
        } else if (Array.isArray(response.data.results)) {
          moods = response.data.results;
        } else {
          // Try to find any array in the response
          const keys = Object.keys(response.data);
          for (const key of keys) {
            if (Array.isArray(response.data[key])) {
              moods = response.data[key];
              break;
            }
          }
        }
      }
      
      console.log('Processed moods array:', moods);
      console.log('Moods array length:', moods ? moods.length : 0);
      console.log('Is array?', Array.isArray(moods));
      
      // If still no array found, create empty array to avoid errors
      if (!Array.isArray(moods)) {
        console.warn('Could not find mood array in response, using empty array');
        moods = [];
      }
      
      // Filter moods by month/year if specified
      let filteredMoods = moods;
      if (month !== undefined && year !== undefined) {
        filteredMoods = moods.filter(mood => {
          const moodDate = new Date(mood.local_date + (mood.local_date.includes('T') ? '' : 'T00:00:00'));
          // Convert to Asia/Colombo timezone for comparison
          const colomboDate = new Date(moodDate.toLocaleString('en-US', { timeZone: 'Asia/Colombo' }));
          return colomboDate.getMonth() === month && colomboDate.getFullYear() === year;
        });
      }
      
      // Process mood data for analysis
      const moodCounts = filteredMoods.length > 0 ? filteredMoods.reduce((acc, mood) => {
        const moodType = mood.mood || 'neutral';
        acc[moodType] = (acc[moodType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) : {};
      
      // Sort moods by date for trend analysis (only if we have moods)
      const sortedMoods = filteredMoods.length > 0 ? [...filteredMoods].sort((a, b) => 
        new Date(a.local_date + (a.local_date.includes('T') ? '' : 'T00:00:00')).getTime() - new Date(b.local_date + (b.local_date.includes('T') ? '' : 'T00:00:00')).getTime()
      ) : [];
      
      // Get recent mood trends (last 30 days or all entries for the selected month)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentMoods = sortedMoods.filter(mood => {
        const moodDate = new Date(mood.local_date + (mood.local_date.includes('T') ? '' : 'T00:00:00'));
        return moodDate >= thirtyDaysAgo;
      });
      
      return {
        totalEntries: filteredMoods.length,
        moodDistribution: moodCounts,
        recentMoods,
        moodTrends: sortedMoods,
        averageMoodScore: calculateAverageMoodScore(filteredMoods),
        averageValence: calculateAverageValence(filteredMoods),
        averageArousal: calculateAverageArousal(filteredMoods),
        averageIntensity: calculateAverageIntensity(filteredMoods),
        lastUpdated: sortedMoods.length > 0 ? sortedMoods[sortedMoods.length - 1].local_date : null
      };
    }
    
    throw new Error('Failed to fetch mood analysis');
  } catch (error) {
    console.error('Get mood analysis error:', error);
    throw error;
  }
};

// Helper function to calculate average mood score
const calculateAverageMoodScore = (moods: MoodEntry[]): number => {
  if (!moods || moods.length === 0) return 0;
  
  // Updated mood scores for the new mood system
  const moodScores: Record<string, number> = {
    'Sad': 1,
    'Anxious': 2,
    'Unpleasant': 2,
    'Neutral': 3,
    'Alert': 3,
    'Calm': 4,
    'Pleasant': 4,
    'Content': 4,
    'Happy': 5,
    'Excited': 5
  };
  
  const validMoods = moods.filter(mood => mood && mood.mood);
  if (validMoods.length === 0) return 0;
  
  const totalScore = validMoods.reduce((sum, mood) => {
    return sum + (moodScores[mood.mood] || 3); // Default to neutral if mood not recognized
  }, 0);
  
  return Math.round((totalScore / validMoods.length) * 10) / 10; // Round to 1 decimal place
};

// Helper function to calculate average valence
const calculateAverageValence = (moods: MoodEntry[]): number => {
  if (!moods || moods.length === 0) return 0;
  
  const validMoods = moods.filter(mood => mood && mood.valence && !isNaN(parseFloat(mood.valence)));
  if (validMoods.length === 0) return 0;
  
  const totalValence = validMoods.reduce((sum, mood) => sum + parseFloat(mood.valence), 0);
  return Math.round((totalValence / validMoods.length) * 100) / 100; // Round to 2 decimal places
};

// Helper function to calculate average arousal
const calculateAverageArousal = (moods: MoodEntry[]): number => {
  if (!moods || moods.length === 0) return 0;
  
  const validMoods = moods.filter(mood => mood && mood.arousal && !isNaN(parseFloat(mood.arousal)));
  if (validMoods.length === 0) return 0;
  
  const totalArousal = validMoods.reduce((sum, mood) => sum + parseFloat(mood.arousal), 0);
  return Math.round((totalArousal / validMoods.length) * 100) / 100; // Round to 2 decimal places
};

// Helper function to calculate average intensity
const calculateAverageIntensity = (moods: MoodEntry[]): number => {
  if (!moods || moods.length === 0) return 0;
  
  const validMoods = moods.filter(mood => mood && mood.intensity && !isNaN(parseFloat(mood.intensity)));
  if (validMoods.length === 0) return 0;
  
  const totalIntensity = validMoods.reduce((sum, mood) => sum + parseFloat(mood.intensity), 0);
  return Math.round((totalIntensity / validMoods.length) * 100) / 100; // Round to 2 decimal places
};

/**
 * Get PHQ-9 questionnaire analysis for a client
 */
export const getClientPHQ9Analysis = async (clientId: string): Promise<PHQ9AnalysisResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<any> = await apiClient.get(`/questionnaire/phq9/user/${clientId}/history`, undefined, token, true);
    
    console.log('Get client PHQ-9 analysis response:', response);
    console.log('Response data type:', typeof response.data);
    console.log('Response data structure:', JSON.stringify(response.data, null, 2));
    
    if (response.success && response.data) {
      // Handle different response structures
      let phq9Entries: PHQ9Entry[] = [];
      
      if (Array.isArray(response.data)) {
        phq9Entries = response.data;
      } else if (response.data && typeof response.data === 'object') {
        if (Array.isArray(response.data.data)) {
          phq9Entries = response.data.data;
        } else if (Array.isArray(response.data.entries)) {
          phq9Entries = response.data.entries;
        } else if (Array.isArray(response.data.results)) {
          phq9Entries = response.data.results;
        } else {
          // Try to find any array in the response
          const keys = Object.keys(response.data);
          for (const key of keys) {
            if (Array.isArray(response.data[key])) {
              phq9Entries = response.data[key];
              break;
            }
          }
        }
      }
      
      console.log('Processed PHQ-9 entries array:', phq9Entries);
      console.log('PHQ-9 entries array length:', phq9Entries ? phq9Entries.length : 0);
      
      // If still no array found, create empty array
      if (!Array.isArray(phq9Entries)) {
        console.warn('Could not find PHQ-9 entries array in response, using empty array');
        phq9Entries = [];
      }
      
      // Process PHQ-9 data for analysis
      const severityDistribution = phq9Entries.length > 0 ? phq9Entries.reduce((acc, entry) => {
        const severity = entry.severity || 'Unknown';
        acc[severity] = (acc[severity] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) : {};
      
      // Sort entries by date for trend analysis
      const sortedEntries = phq9Entries.length > 0 ? [...phq9Entries].sort((a, b) => 
        new Date(a.completedAt + (a.completedAt.includes('T') ? '' : 'T00:00:00')).getTime() - new Date(b.completedAt + (b.completedAt.includes('T') ? '' : 'T00:00:00')).getTime()
      ) : [];
      
      // Get recent entries (last 6 months)
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      
      const recentEntries = sortedEntries.filter(entry => {
        const entryDate = new Date(entry.completedAt + (entry.completedAt.includes('T') ? '' : 'T00:00:00'));
        return entryDate >= sixMonthsAgo;
      });
      
      // Calculate score history
      const scoreHistory = sortedEntries.map(entry => ({
        date: entry.completedAt,
        score: entry.totalScore,
        severity: entry.severity
      }));
      
      // Determine severity trend
      const severityTrend = calculateSeverityTrend(sortedEntries);
      
      // Calculate average score
      const averageScore = calculateAveragePHQ9Score(phq9Entries);
      
      // Check for risk indicators (item 9 positive or severe scores)
      const hasRiskIndicators = phq9Entries.some(entry => 
        entry.hasItem9Positive || entry.totalScore >= 20
      );
      
      return {
        totalEntries: phq9Entries.length,
        averageScore,
        currentSeverity: sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1].severity : null,
        severityTrend,
        recentEntries,
        severityDistribution,
        scoreHistory,
        lastUpdated: sortedEntries.length > 0 ? sortedEntries[sortedEntries.length - 1].completedAt : null,
        hasRiskIndicators
      };
    }
    
    throw new Error('Failed to fetch PHQ-9 analysis');
  } catch (error) {
    console.error('Get PHQ-9 analysis error:', error);
    throw error;
  }
};

// Helper function to calculate average PHQ-9 score
const calculateAveragePHQ9Score = (entries: PHQ9Entry[]): number => {
  if (!entries || entries.length === 0) return 0;
  
  const validEntries = entries.filter(entry => entry && typeof entry.totalScore === 'number');
  if (validEntries.length === 0) return 0;
  
  const totalScore = validEntries.reduce((sum, entry) => sum + entry.totalScore, 0);
  return Math.round((totalScore / validEntries.length) * 10) / 10;
};

// Helper function to calculate severity trend
const calculateSeverityTrend = (sortedEntries: PHQ9Entry[]): 'improving' | 'worsening' | 'stable' | 'insufficient_data' => {
  if (sortedEntries.length < 2) return 'insufficient_data';
  
  const recent = sortedEntries.slice(-3); // Last 3 entries
  if (recent.length < 2) return 'insufficient_data';
  
  const scores = recent.map(entry => entry.totalScore);
  const firstScore = scores[0];
  const lastScore = scores[scores.length - 1];
  
  const difference = lastScore - firstScore;
  
  if (Math.abs(difference) <= 2) return 'stable';
  return difference < 0 ? 'improving' : 'worsening';
};

/**
 * Create a new client note
 */
export const createClientNote = async (clientId: string, noteData: {
  content: string;
  isPrivate: boolean;
}): Promise<{ success: boolean; data: ClientNote }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ data: ClientNote }> = await apiClient.post(`/counsellor/clients/${clientId}/notes`, noteData, token, true);
    
    console.log('Create client note response:', response);
    console.log('Response data structure:', JSON.stringify(response, null, 2));
    
    if (response.success && response.data) {
      // Handle potentially nested response structure
      const noteData = response.data.data || response.data;
      console.log('Extracted note data:', noteData);
      
      return {
        success: true,
        data: noteData
      };
    }
    
    throw new Error('Failed to create client note');
  } catch (error) {
    console.error('Create client note error:', error);
    throw error;
  }
};

/**
 * Delete a client note
 */
export const deleteClientNote = async (clientId: string, noteId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ message: string }> = await apiClient.delete(`/counsellor/clients/${clientId}/notes/${noteId}`, token, true);
    
    console.log('Delete client note response:', response);
    
    if (response.success) {
      return {
        success: true,
        message: response.data?.message || 'Note deleted successfully'
      };
    }
    
    throw new Error('Failed to delete client note');
  } catch (error) {
    console.error('Delete client note error:', error);
    throw error;
  }
};

export const updateClientNote = async (clientId: string, noteId: number, noteData: {
  content: string;
  isPrivate: boolean;
}): Promise<{ success: boolean; data: ClientNote }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    console.log(`Making PUT request to: /counsellor/clients/${clientId}/notes/${noteId}`);
    console.log('Request payload:', noteData);

    const response: ApiResponse<{ data: ClientNote }> = await apiClient.put(`/counsellor/clients/${clientId}/notes/${noteId}`, noteData, token, true);
    
    console.log('Update client note response:', response);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: response.data.data || response.data
      };
    }
    
    throw new Error('Failed to update client note');
  } catch (error) {
    console.error('Update client note error:', error);
    throw error;
  }
};

/**
 * Add a concern to a client
 */
export const addClientConcern = async (clientId: string, concern: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ message: string }> = await apiClient.post(`/counsellor/clients/${clientId}/concerns`, { concern }, token, true);
    
    console.log('Add client concern response:', response);
    
    if (response.success) {
      return {
        success: true,
        message: response.data?.message || 'Concern added successfully'
      };
    }
    
    throw new Error('Failed to add client concern');
  } catch (error) {
    console.error('Add client concern error:', error);
    throw error;
  }
};

/**
 * Remove a concern from a client
 */
export const removeClientConcern = async (clientId: string, concern: string): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    console.log('Removing concern:', { clientId, concern, endpoint: `/counsellor/clients/${clientId}/concerns` });

    // Try using axios directly to ensure DELETE with body works
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';
    const fullUrl = `${baseURL}/counsellor/clients/${clientId}/concerns`;
    
    console.log('Making DELETE request to:', fullUrl, 'with data:', { concern });
    
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({ concern })
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Remove client concern response:', responseData);
    
    return {
      success: true,
      message: responseData?.message || 'Concern removed successfully'
    };
  } catch (error) {
    console.error('Remove client concern error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      clientId,
      concern,
      endpoint: `/counsellor/clients/${clientId}/concerns`
    });
    throw error;
  }
};

/**
 * Get counsellor's blogs
 */
export const getBlogs = async (params?: { 
  status?: string; 
  limit?: number; 
  offset?: number;
}): Promise<Blog[]> => {
  try {
    const response: ApiResponse<Blog[]> = await apiClient.get('/counsellor/blogs', params, undefined, true);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to fetch blogs');
  } catch (error) {
    console.error('Get blogs error:', error);
    throw error;
  }
};

/**
 * Get recent activities
 */
export const getRecentActivities = async (limit: number = 10): Promise<Activity[]> => {
  try {
    const response: ApiResponse<{data: Activity[], message: string, success: boolean}> = await apiClient.get('/counsellor/activity/recent', { limit }, undefined, true);
    
    if (response.success && response.data && response.data.data) {
      return response.data.data;
    }
    
    throw new Error('Failed to fetch recent activities');
  } catch (error) {
    console.error('Get recent activities error:', error);
    throw error;
  }
};

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = async (): Promise<PerformanceMetrics> => {
  try {
    const response: ApiResponse<PerformanceMetrics> = await apiClient.get('/counsellor/performance/metrics', undefined, undefined, true);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to fetch performance metrics');
  } catch (error) {
    console.error('Get performance metrics error:', error);
    throw error;
  }
};

// Profile interfaces
export interface CounsellorProfileData {
  id: number;
  firstName: string;
  lastName: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  joinDate: string;
  specializations: string[];
  languages: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  totalSessions: number;
  totalClients: number;
  status: 'available' | 'busy' | 'away';
  lastActiveAt: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    x?: string;
  };
  instagram?: string;
  linkedin?: string;
  x?: string;
  credentials: Credential[];
  achievements: Achievement[];
}

export interface Credential {
  id: number;
  title: string;
  institution: string;
  year: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * Get detailed counsellor profile
 */
export const getCounsellorProfile = async (): Promise<CounsellorProfileData> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<any> = await apiClient.get('/counsellor/profile/detailed', undefined, token, true);
    
    if (response.success && response.data) {
      // Check if data is nested or direct
      const profileData = response.data.data || response.data;
      return profileData;
    }
    
    throw new Error('Failed to fetch counsellor profile');
  } catch (error) {
    console.error('Get counsellor profile error:', error);
    throw error;
  }
};

/**
 * Update counsellor profile
 */
export const updateCounsellorProfile = async (profileData: Partial<CounsellorProfileData>): Promise<CounsellorProfileData> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    // Flatten socialLinks from nested object to top-level fields
    const flattenedData: any = { ...profileData };
    if (profileData.socialLinks) {
      flattenedData.instagram = profileData.socialLinks.instagram;
      flattenedData.linkedin = profileData.socialLinks.linkedin;
      flattenedData.x = profileData.socialLinks.x;
      delete flattenedData.socialLinks;
    }

    console.log('Updating profile with flattened data:', flattenedData);

    const response: ApiResponse<any> = await apiClient.put('/counselors/profile', flattenedData, token, true);
    console.log('Update profile response:', response);

    if (response.success && response.data) {
      // Check if data is nested or direct
      const updatedProfileData = response.data.data || response.data;
      return updatedProfileData;
    }

    // If response has an error message, throw it with proper details
    const errorMessage = response.data?.message || response.message || 'Failed to update counsellor profile';
    const errorDetails = response.data || {};

    const error = new Error(errorMessage);
    (error as any).details = errorDetails;
    throw error;
  } catch (error) {
    console.error('Update counsellor profile error:', error);
    throw error;
  }
};

/**
 * Upload profile image
 */
export const uploadProfileImage = async (imageFile: File): Promise<{ profileImage: string }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ profileImage: string }> = await apiClient.uploadFile('/counsellor/profile/image', imageFile, undefined, token, true);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to upload profile image');
  } catch (error) {
    console.error('Upload profile image error:', error);
    throw error;
  }
};

/**
 * Upload cover image
 */
export const uploadCoverImage = async (imageFile: File): Promise<{ coverImage: string }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ coverImage: string }> = await apiClient.uploadFile('/counsellor/profile/cover', imageFile, undefined, token, true);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to upload cover image');
  } catch (error) {
    console.error('Upload cover image error:', error);
    throw error;
  }
};

/**
 * Get earnings data
 */
export const getEarnings = async (params?: { 
  startDate?: string; 
  endDate?: string; 
  period?: 'monthly' | 'weekly' | 'yearly';
}): Promise<any> => {
  try {
    const response: ApiResponse<any> = await apiClient.get('/counsellor/earnings', params, undefined, true);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to fetch earnings');
  } catch (error) {
    console.error('Get earnings error:', error);
    throw error;
  }
};

// Posts interfaces for blogs
export interface PostAuthor {
  name: string;
  avatar: string;
  role: string;
}

export interface PostStats {
  views: number;
  likes: number;
  comments: number;
}

export interface Post {
  id: string;
  author: PostAuthor;
  timeAgo: string;
  content: string;
  hashtags: string[];
  stats: PostStats;
  backgroundColor: string;
  liked: boolean;
  image?: string | null;
  isAnonymous: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface PostsResponse {
  posts: Post[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Get counsellor's posts (blogs)
 */
export const getPosts = async (params?: { 
  page?: number; 
  limit?: number;
}): Promise<{ data: PostsResponse }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ data: PostsResponse }> = await apiClient.get('/posts/', params, token, true);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to fetch posts');
  } catch (error) {
    console.error('Get posts error:', error);
    throw error;
  }
};

/**
 * Get counsellor's own posts (only posts created by the authenticated counsellor)
 */
export const getMyPosts = async (params?: { 
  page?: number; 
  limit?: number;
}): Promise<{ data: PostsResponse }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ data: PostsResponse }> = await apiClient.get('/posts/my-posts', params, token, true);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to fetch my posts');
  } catch (error) {
    console.error('Get my posts error:', error);
    throw error;
  }
};

/**
 * Get a single post by ID
 */
export const getPost = async (postId: string): Promise<Post> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ data: Post }> = await apiClient.get(`/posts/${postId}`, undefined, token, true);
    
    if (response.success && response.data) {
      // Handle nested or direct response structure
      return response.data.data || response.data;
    }
    
    throw new Error('Failed to fetch post');
  } catch (error) {
    console.error('Get post error:', error);
    throw error;
  }
};

// Post creation and update interfaces
export interface CreatePostData {
  content: string;
  hashtags: string[];
  backgroundColor?: string;
  image?: string;
  isAnonymous?: boolean;
}

export interface UpdatePostData {
  content: string;
  hashtags: string[];
  backgroundColor?: string;
  image?: string;
  isAnonymous?: boolean;
}

export interface CreatePostResponse {
  success: boolean;
  data: Post;
}

export interface UpdatePostResponse {
  success: boolean;
  data: Post;
}

/**
 * Create a new post
 */
export const createPost = async (postData: CreatePostData): Promise<CreatePostResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<any> = await apiClient.post('/posts/', postData, token, true);
    
    console.log('Raw API response:', response);
    
    // Handle the backend response structure
    if (response.success) {
      // The backend returns { success: true, data: post }
      // But our apiClient might wrap it, so check both structures
      if (response.data && response.data.data) {
        // Wrapped response: { success: true, data: { success: true, data: post } }
        return response.data;
      } else if (response.data) {
        // Direct response: { success: true, data: post }
        return {
          success: response.success,
          data: response.data
        };
      }
    }
    
    throw new Error('Failed to create post');
  } catch (error) {
    console.error('Create post error:', error);
    throw error;
  }
};

/**
 * Update an existing post
 */
export const updatePost = async (postId: string, postData: UpdatePostData): Promise<UpdatePostResponse> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<UpdatePostResponse> = await apiClient.put(`/posts/${postId}`, postData, token, true);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to update post');
  } catch (error) {
    console.error('Update post error:', error);
    throw error;
  }
};

/**
 * Delete a post
 */
export const deletePost = async (postId: string): Promise<{ success: boolean; message?: string }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ message?: string }> = await apiClient.delete(`/posts/${postId}`, token, true);
    
    if (response.success) {
      return {
        success: true,
        message: response.data?.message || 'Post deleted successfully'
      };
    }
    
    throw new Error('Failed to delete post');
  } catch (error) {
    console.error('Delete post error:', error);
    throw error;
  }
};

/**
 * Like a post
 */
export const likePost = async (postId: string): Promise<{ success: boolean; likes?: number }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Authentication token not found');

    const response: ApiResponse<any> = await apiClient.post(`/posts/${postId}/like`, {}, token, true);

    if (response.success) {
      const data = (response.data?.data ?? response.data) as { likes?: number };
      return { success: true, likes: data?.likes };
    }
    throw new Error('Failed to like post');
  } catch (error) {
    console.error('Like post error:', error);
    throw error;
  }
};

/**
 * Unlike a post
 */
export const unlikePost = async (postId: string): Promise<{ success: boolean; likes?: number }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Authentication token not found');

    // Assuming DELETE /posts/:id/like unlikes
    const response: ApiResponse<any> = await apiClient.delete(`/posts/${postId}/like`, token, true);

    if (response.success) {
      const data = (response.data?.data ?? response.data) as { likes?: number };
      return { success: true, likes: data?.likes };
    }
    throw new Error('Failed to unlike post');
  } catch (error) {
    console.error('Unlike post error:', error);
    throw error;
  }
};

/**
 * Get like status for a post (liked by current user and total likes)
 */
export const getPostLikeStatus = async (postId: string): Promise<{ liked: boolean; likes: number; views: number }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Authentication token not found');

    const response: ApiResponse<any> = await apiClient.get(`/posts/${postId}/like/status`, undefined, token, true);

    if (response.success && response.data) {
      const data = response.data.data ?? response.data;
      return {
        liked: Boolean(data.liked),
        likes: typeof data.likes === 'number' ? data.likes : 0,
        views: typeof data.views === 'number' ? data.views : 0,
      };
    }
    throw new Error('Failed to get like status');
  } catch (error) {
    console.error('Get post like status error:', error);
    throw error;
  }
};

/**
 * Toggle like for a post. Backend route: POST /posts/:postId/like/toggle
 */
export const toggleLikePost = async (postId: string): Promise<{ liked?: boolean; likes?: number; views?: number }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Authentication token not found');

    const response: ApiResponse<any> = await apiClient.post(`/posts/${postId}/like/toggle`, {}, token, true);

    if (response.success) {
      const data = response.data?.data ?? response.data;
      return { liked: data?.liked, likes: data?.likes, views: data?.views };
    }
    throw new Error('Failed to toggle like');
  } catch (error) {
    console.error('Toggle like post error:', error);
    throw error;
  }
};

/**
 * Increment view count for a post after user views it
 * The backend should handle checking if the viewer is the author
 */
export const incrementPostView = async (postId: string): Promise<{ views?: number }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) throw new Error('Authentication token not found');

    const response: ApiResponse<any> = await apiClient.post(`/posts/${postId}/view`, {}, token, true);
    if (response.success) {
      const data = response.data?.data ?? response.data;
      return { views: data?.views };
    }
    throw new Error('Failed to increment post view');
  } catch (error) {
    console.error('Increment post view error:', error);
    throw error;
  }
};

// Volunteer status interface
export interface VolunteerStatusData {
  isVolunteer: boolean;
  sessionFee: number;
}

/**
 * Update counsellor volunteer status and session fee
 */
export const updateCounsellorVolunteerStatus = async (volunteerData: VolunteerStatusData): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    console.log('Updating volunteer status with data:', volunteerData);

    const response: ApiResponse<{ message: string }> = await apiClient.put('/counselors/volunteer-status', volunteerData, token, true);

    console.log('Update volunteer status response:', response);

    if (response.success) {
      return {
        success: true,
        message: response.data?.message || 'Volunteer status updated successfully'
      };
    }

    throw new Error('Failed to update volunteer status');
  } catch (error) {
    console.error('Update volunteer status error:', error);
    throw error;
  }
};

/**
 * Get counsellor volunteer status and session fee
 */
export const getCounsellorVolunteerStatus = async (): Promise<VolunteerStatusData> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ data: VolunteerStatusData }> = await apiClient.get('/counselors/volunteer-status', undefined, token, true);

    console.log('Get volunteer status API response:', response);
    console.log('Response data:', response.data);

    if (response.success && response.data) {
      const volunteerData = response.data.data || response.data;
      console.log('Extracted volunteer data:', volunteerData);
      return volunteerData;
    }

    throw new Error('Failed to fetch volunteer status');
  } catch (error) {
    console.error('Get volunteer status error:', error);
    throw error;
  }
};

// Earnings interfaces
export interface EarningsSummary {
  totalEarnings: number;
  thisMonth: number;
  lastMonth: number;
  pendingAmount: number;
  totalSessions: number;
  avgPerSession: number;
}

export interface MonthlyEarning {
  month: string;
  earnings: number;
  sessions: number;
}

/**
 * Get counsellor earnings summary
 */
export const getEarningsSummary = async (): Promise<EarningsSummary> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ data: EarningsSummary }> = await apiClient.get('/counselors/earnings/summary', undefined, token, true);

    console.log('Get earnings summary response:', response);

    if (response.success && response.data) {
      return response.data.data || response.data;
    }

    throw new Error('Failed to fetch earnings summary');
  } catch (error) {
    console.error('Get earnings summary error:', error);
    throw error;
  }
};

export interface ClientEarnings {
  clientId: number;
  clientName: string;
  totalEarnings: number;
  totalSessions: number;
  lastSessionDate: string;
}

/**
 * Get counsellor monthly earnings data
 */
export const getMonthlyEarnings = async (): Promise<MonthlyEarning[]> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ data: MonthlyEarning[] }> = await apiClient.get('/counselors/earnings/monthly', undefined, token, true);

    console.log('Get monthly earnings response:', response);

    if (response.success && response.data) {
      return response.data.data || response.data;
    }

    throw new Error('Failed to fetch monthly earnings');
  } catch (error) {
    console.error('Get monthly earnings error:', error);
    throw error;
  }
};

/**
 * Get earnings data for a specific client
 */
export const getClientEarnings = async (clientId: number): Promise<{ totalEarnings: number; totalSessions: number }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    const response: ApiResponse<{ data: { totalEarnings: number; totalSessions: number } }> = await apiClient.get(`/counselors/earnings/per-client/${clientId}`, undefined, token, true);

    console.log('Get client earnings response:', response);

    if (response.success && response.data) {
      return response.data.data || response.data;
    }

    throw new Error('Failed to fetch client earnings');
  } catch (error) {
    console.error('Get client earnings error:', error);
    throw error;
  }
};

