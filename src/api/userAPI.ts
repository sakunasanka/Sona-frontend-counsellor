import { apiClient, ApiResponse } from './apiBase';

interface CounselorSignin {
  success: boolean;
  data: {
    token: string;
    tokenType: string;
    expiresIn: number;
    uid: string;
    idToken: string;
    email: string;
    displayName: string;
  }
}

interface SigninRequest {
  email: string;
  password: string;
}

export const signinCounselor = async (credentials: SigninRequest): Promise<CounselorSignin> => {
  try {
    const response: ApiResponse<CounselorSignin> = await apiClient.post('/auth/signin', credentials);
    
    if (response.success && response.data) {
      const { token } = response.data.data;
      apiClient.setAuthToken(token);
      
      return response.data;
    }
    
    throw new Error('Signin failed: Invalid response format');
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};

export const signoutCounselor = async (): Promise<void> => {
  try {
    await apiClient.post('/api/auth/signout', {}, undefined, true);
    // Remove the auth token
    apiClient.removeAuthToken();
  } catch (error) {
    console.error('Signout error:', error);
    // Still remove token even if API call fails
    apiClient.removeAuthToken();
    throw error;
  }
};

export const getCurrentUser = async (): Promise<CounselorSignin['data']> => {
  try {
    const response: ApiResponse<CounselorSignin['data']> = await apiClient.get('/api/auth/profile', undefined, undefined, true);
    
    if (response.success && response.data) {
      return response.data;
    }
    
    throw new Error('Failed to get user profile');
  } catch (error) {
    console.error('Get current user error:', error);
    throw error;
  }
};