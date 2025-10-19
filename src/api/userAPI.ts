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
      
      // Store token in localStorage
      localStorage.setItem('auth_token', token);
      
      // Decode JWT token to extract counsellor_id
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        
        if (payload && payload.id) {
          localStorage.setItem('counsellor_id', payload.id.toString());
        }
      } catch (decodeError) {
        console.error('Error decoding token for counsellor_id:', decodeError);
      }
      
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
    // Remove the auth token and user data
    apiClient.removeAuthToken();
    localStorage.removeItem('counsellor_id');
  } catch (error) {
    console.error('Signout error:', error);
    // Still remove token and user data even if API call fails
    apiClient.removeAuthToken();
    localStorage.removeItem('counsellor_id');
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