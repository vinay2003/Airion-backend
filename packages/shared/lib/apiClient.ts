import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Standard API Response Structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error: string | null;
  statusCode?: number;
}

/**
 * Ease2event Shared API Client
 * Centralized instance for all portals with standard interceptors
 */
export class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL?: string) {
    let resolvedBaseURL = baseURL || (import.meta.env?.VITE_API_URL as string) || '/api';

    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
        if (resolvedBaseURL.includes('localhost') || resolvedBaseURL.includes('127.0.0.1')) {
          resolvedBaseURL = '/api';
        }
      }
    }

    this.instance = axios.create({
      baseURL: resolvedBaseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30s failsafe to accommodate cold-starts of remote serverless DBs
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    // Request Interceptor: Auth Token Injection
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('ease2event_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Standardized Unwrapping & Error Handling
    this.instance.interceptors.response.use(
      (response) => {
        // Automatically unwrap NestJS standardization { success, data, error }
        if (response.data && response.data.success === true && response.data.data !== undefined) {
          return response.data.data;
        }
        return response.data;
      },
      (error: AxiosError<any>) => {
        const standardError: ApiResponse = {
          success: false,
          data: null,
          error: error.response?.data?.error || error.response?.data?.message || error.message || 'An unexpected error occurred',
          statusCode: error.response?.status
        };

        // Handle 401 Unauthorized globally
        if (error.response?.status === 401) {
          localStorage.removeItem('ease2event_token');
          // Optional: Dispatch event or redirect if window is available
          if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
             // window.location.href = '/login'; // Let consumer handle if needed
          }
        }

        return Promise.reject(standardError);
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.instance;
  }

  // Helper methods to simplify common operations
  public async get<T>(url: string, config?: any): Promise<T> {
    return this.instance.get<any, T>(url, config);
  }

  public async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.instance.post<any, T>(url, data, config);
  }

  public async put<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.instance.put<any, T>(url, data, config);
  }

  public async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.instance.patch<any, T>(url, data, config);
  }

  public async delete<T>(url: string, config?: any): Promise<T> {
    return this.instance.delete<any, T>(url, config);
  }
}

// Global singleton instance
export const api = new ApiClient();
export default api;
