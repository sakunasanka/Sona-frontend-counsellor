import { apiClient, ApiResponse } from './apiBase';

// Types for dashboard data
export interface DashboardStats {
  totalSessions: number;
  upcomingSessions: number;
  totalClients: number;
  averageRating: number;
  monthlyEarnings: number;
  totalBlogs: number;
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
  status: 'active' | 'inactive' | 'new';
  last_session: string | null;
  total_sessions: number;
  next_appointment: string | null;
  progress_status: 'starting' | 'improving' | 'stable' | 'concerning';
}

// Extended client interface for detailed view
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
  title: string;
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
    const response: ApiResponse<DashboardStats> = await apiClient.get('/counsellor/dashboard/stats', undefined, undefined, true);
    
    if (response.success && response.data) {
      return response.data;
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
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
          const startDate = new Date(params.startDate);
          const endDate = new Date(params.endDate);
          sessions = sessions.filter(session => {
            const sessionDate = new Date(session.date);
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

    console.log('Updating profile with data:', profileData);
    
    const response: ApiResponse<any> = await apiClient.put('/counselors/profile', profileData, token, true);
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

// Post creation and update interfaces
export interface CreatePostData {
  content: string;
  hashtags: string[];
  backgroundColor?: string;
  image?: string;
}

export interface UpdatePostData {
  content: string;
  hashtags: string[];
  backgroundColor?: string;
  image?: string;
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

