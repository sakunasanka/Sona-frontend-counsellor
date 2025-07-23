import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Define types for API responses
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: Record<string, unknown>;
}

// HTTP Methods enum
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

// Request configuration interface
export interface ApiRequestConfig {
  method: HttpMethod;
  endpoint: string;
  data?: Record<string, unknown> | FormData | unknown[] | unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  authToken?: string;
  requiresAuth?: boolean;
  timeout?: number;
}

export class ApiBase {
  private axiosInstance: AxiosInstance;
  private baseURL: string;
  private defaultTimeout: number = 10000; // 10 seconds

  constructor(baseURL?: string) {
    this.baseURL = baseURL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: this.defaultTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        // You can add global request modifications here
        console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(`✅ Response received from: ${response.config.url}`);
        return response;
      },
      (error) => {
        console.error('❌ Response error:', error);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Main method to make API calls
   */
  async makeRequest<T = unknown>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
    try {
      const requestConfig: AxiosRequestConfig = {
        method: config.method.toLowerCase() as 'get' | 'post' | 'put' | 'patch' | 'delete',
        url: config.endpoint,
        timeout: config.timeout || this.defaultTimeout,
        headers: {
          ...config.headers,
        },
      };

      // Add authentication token if provided
      if (config.authToken || config.requiresAuth) {
        const token = config.authToken || this.getStoredToken();
        if (token) {
          requestConfig.headers!.Authorization = `Bearer ${token}`;
        } else if (config.requiresAuth) {
          throw new Error('Authentication token is required but not provided');
        }
      }

      // Add data for POST, PUT, PATCH requests
      if ([HttpMethod.POST, HttpMethod.PUT, HttpMethod.PATCH].includes(config.method)) {
        requestConfig.data = config.data;
      }

      // Add query parameters
      if (config.params) {
        requestConfig.params = config.params;
      }

      const response: AxiosResponse<T> = await this.axiosInstance.request(requestConfig);

      return {
        data: response.data,
        message: response.statusText,
        status: response.status,
        success: true,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * GET request helper
   */
  async get<T = unknown>(
    endpoint: string,
    params?: Record<string, unknown>,
    authToken?: string,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: HttpMethod.GET,
      endpoint,
      params,
      authToken,
      requiresAuth,
    });
  }

  /**
   * POST request helper
   */
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    authToken?: string,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: HttpMethod.POST,
      endpoint,
      data,
      authToken,
      requiresAuth,
    });
  }

  /**
   * PUT request helper
   */
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    authToken?: string,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: HttpMethod.PUT,
      endpoint,
      data,
      authToken,
      requiresAuth,
    });
  }

  /**
   * PATCH request helper
   */
  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    authToken?: string,
    requiresAuth: boolean = false
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: HttpMethod.PATCH,
      endpoint,
      data,
      authToken,
      requiresAuth,
    });
  }

  /**
   * DELETE request helper
   */
  async delete<T = unknown>(
    endpoint: string,
    authToken?: string,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>({
      method: HttpMethod.DELETE,
      endpoint,
      authToken,
      requiresAuth,
    });
  }

  /**
   * Upload file helper
   */
  async uploadFile<T = unknown>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, string | number | boolean>,
    authToken?: string,
    requiresAuth: boolean = true
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, String(additionalData[key]));
      });
    }

    return this.makeRequest<T>({
      method: HttpMethod.POST,
      endpoint,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      authToken,
      requiresAuth,
    });
  }

  /**
   * Set global authorization token
   */
  setAuthToken(token: string): void {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('auth_token', token);
  }

  /**
   * Remove authorization token
   */
  removeAuthToken(): void {
    delete this.axiosInstance.defaults.headers.common['Authorization'];
    localStorage.removeItem('auth_token');
  }

  /**
   * Get stored token from localStorage
   */
  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Handle and format errors
   */
  private handleError(error: unknown): ApiError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string;
        code?: string;
        [key: string]: unknown;
      }>;
      
      if (axiosError.response) {
        // Server responded with error status
        const responseData = axiosError.response.data;
        return {
          message: responseData?.message || axiosError.message || 'Server error',
          status: axiosError.response.status,
          code: responseData?.code,
          details: responseData as Record<string, unknown>,
        };
      } else if (axiosError.request) {
        // Request was made but no response received
        return {
          message: 'Network error - no response from server',
          status: 0,
          code: 'NETWORK_ERROR',
        };
      }
    }

    // Other errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return {
      message: errorMessage,
      status: 500,
      code: 'UNKNOWN_ERROR',
    };
  }

  /**
   * Set base URL
   */
  setBaseURL(url: string): void {
    this.baseURL = url;
    this.axiosInstance.defaults.baseURL = url;
  }

  /**
   * Get current base URL
   */
  getBaseURL(): string {
    return this.baseURL;
  }

  /**
   * Set default timeout
   */
  setTimeout(timeout: number): void {
    this.defaultTimeout = timeout;
    this.axiosInstance.defaults.timeout = timeout;
  }
}

// Create and export a singleton instance
export const apiClient = new ApiBase();

// Export default instance
export default apiClient;