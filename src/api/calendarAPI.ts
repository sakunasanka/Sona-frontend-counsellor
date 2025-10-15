import { apiClient, ApiResponse, makeRequest } from './apiBase';

// Types for calendar data
export interface TimeSlot {
  id: number;
  counselorId: number;
  date: string;
  time: string;
  isBooked: boolean;
  isAvailable: boolean;
  updatedAt: string;
  createdAt: string;
}

// UI-facing session shape used in calendar components
export interface Session {
  id: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'ongoing';
}

// Backend session shape returned by /sessions/counselor/:id
interface BackendSession {
  id: number;
  userId: number;
  counselorId: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  duration: number;
  price: number;
  notes: string | null;
  status: 'scheduled' | 'pending' | 'completed' | string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    avatar: string | null;
  };
  isStudent?: boolean;
}

export interface AvailabilityRequest {
  Counselorid: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
}

export interface MonthlyAvailabilitySlot {
  id: number;
  time: string;
  isAvailable: boolean;
  isBooked: boolean;
}

export interface DayAvailability {
  date: string;
  slots: MonthlyAvailabilitySlot[];
}

export interface MonthlyAvailabilityResponse {
  counselorId: number;
  year: number;
  month: number;
  availability: DayAvailability[];
}

/**
 * Get counselor's time slots for a specific date
 */

export const getMonthlyAvailability = async (counselorId: number, year: number, month: number): Promise<MonthlyAvailabilityResponse> => {
  try {
    // Use base-relative endpoint (baseURL already includes /api)
    const response = await makeRequest<{success: boolean; message: string; data: MonthlyAvailabilityResponse}>(`/sessions/counselors/${counselorId}/availability/${year}/${month}`, 'GET');
    console.log(`[calendarAPI] getMonthlyAvailability response for ${year}-${month}:`, response);
    
    if (response && response.success && response.data) {
      return response.data;
    }
    return { counselorId, year, month, availability: [] };
  } catch (error) {
    console.error(`[calendarAPI] Error fetching monthly availability for ${counselorId} in ${year}-${month}:`, error);
    throw error;
  }
};

/**
 * Set availability for counselor
 */
export const setAvailability = async (availabilityData: AvailabilityRequest): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    console.log('[setAvailability] Sending request:', availabilityData);

    const response: ApiResponse<{ message: string }> = await apiClient.post(
      `/sessions/availability`,
      availabilityData,
      token,
      true
    );
    
    console.log('[setAvailability] Response received:', response);
    
    if (response.success) {
      return {
        success: true,
        message: response.data?.message || 'Availability set successfully'
      };
    }
    
    throw new Error('Failed to set availability');
  } catch (error) {
    console.error('Set availability error:', error);
    throw error;
  }
};

/**
 * Set unavailability for counselor
 */
export const setUnavailability = async (unavailabilityData: AvailabilityRequest): Promise<{ success: boolean; message: string }> => {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('Authentication token not found');
    }

    console.log('[setUnavailability] Sending request:', unavailabilityData);

    const response: ApiResponse<{ message: string }> = await apiClient.post(
      `/sessions/unavailability`,
      unavailabilityData,
      token,
      true
    );
    
    console.log('[setUnavailability] Response received:', response);
    
    if (response.success) {
      return {
        success: true,
        message: response.data?.message || 'Unavailability set successfully'
      };
    }
    
    throw new Error('Failed to set unavailability');
  } catch (error) {
    console.error('Set unavailability error:', error);
    throw error;
  }
};

/**
 * Get counselor's sessions
 */
export const getCounselorSessions = async (counselorId: number): Promise<Session[]> => {
  try {
    // Use base-relative endpoint and map backend shape to UI shape
    const response = await makeRequest<{success: boolean; data: BackendSession[]}>(`/sessions/counselor/${counselorId}`, 'GET');
    console.log(`[calendarAPI] getCounselorSessions raw response:`, response);
    
    if (response && response.success && response.data) {
      const mapped: Session[] = response.data.map((s) => ({
        id: String(s.id),
        clientName: s.user?.name || 'Unknown',
        date: s.date,
        time: s.timeSlot,
        duration: s.duration,
        // Use actual backend status values
        status: s.status as Session['status'],
      }));
      return mapped;
    }
    
    return [];
  } catch (error) {
    console.error('Get sessions error:', error);
    throw error;
  }
};