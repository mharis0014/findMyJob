/**
 * API Service Layer with caching, interceptors, and error handling
 *
 * This module provides a standardized interface for making API requests
 * with features like:
 * - Request caching
 * - Automatic retries
 * - Authentication token handling
 * - Request/response logging
 * - Error normalization
 */

import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios'
import {MMKV} from 'react-native-mmkv'
import NetInfo from '@react-native-community/netinfo'

import LocalStorage from '../utils/localStorage'
import Performance from '../utils/performance'

// Constants for the API service
const API_URL = 'https://api.findmyjob.com' // Replace with your actual API URL
const API_TIMEOUT = 15000 // 15 seconds
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Storage for API caching
const apiCache = new MMKV({
  id: 'api-cache',
})

// API request types for type-safety
type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface ApiRequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean
  skipCache?: boolean
  retries?: number
  cacheTime?: number // Time in milliseconds to keep cache valid
  mockData?: unknown // For testing or offline development
}

interface ApiError extends Error {
  status?: number
  code?: string
  data?: unknown
  isNetworkError?: boolean
  isTimeout?: boolean
  originalError?: AxiosError
}

// Main API client class
class ApiClient {
  private client: AxiosInstance
  private isRefreshingToken = false
  private refreshSubscribers: Array<(token: string) => void> = []

  constructor() {
    // Create base Axios instance
    this.client = axios.create({
      baseURL: API_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    // Add request interceptor for authentication and request logging
    this.client.interceptors.request.use(
      async config => {
        const requestConfig = config as ApiRequestConfig

        // Don't add auth header if explicitly skipped
        if (!requestConfig.skipAuth) {
          const token = await LocalStorage.getItem('authToken')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }

        // Log request for development
        if (__DEV__) {
          console.log('API REQUEST:', {
            url: config.url,
            method: config.method,
            data: config.data,
            headers: config.headers,
          })
        }

        return config
      },
      error => {
        return Promise.reject(this.normalizeError(error))
      },
    )

    // Add response interceptor for response logging and authentication handling
    this.client.interceptors.response.use(
      response => {
        // Log response for development
        if (__DEV__) {
          console.log('API RESPONSE:', {
            url: response.config.url,
            status: response.status,
            data: response.data,
          })
        }

        return response
      },
      async error => {
        const originalRequest = error.config as ApiRequestConfig

        // Handle token expiration (401 Unauthorized)
        if (error.response?.status === 401 && !originalRequest._isRetry) {
          if (!this.isRefreshingToken) {
            this.isRefreshingToken = true
            try {
              const newToken = await this.refreshToken()

              // Retry all queued requests with new token
              this.refreshSubscribers.forEach(callback => callback(newToken))
              this.refreshSubscribers = []

              // Retry current request with new token
              originalRequest._isRetry = true
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              return this.client(originalRequest)
            } catch (refreshError) {
              // If refresh fails, log out the user
              await LocalStorage.removeItem('authToken')
              await LocalStorage.removeItem('refreshToken')
              return Promise.reject(this.normalizeError(refreshError))
            } finally {
              this.isRefreshingToken = false
            }
          } else {
            // Queue the request to be retried after token refresh
            return new Promise(resolve => {
              this.refreshSubscribers.push(token => {
                originalRequest.headers.Authorization = `Bearer ${token}`
                resolve(this.client(originalRequest))
              })
            })
          }
        }

        return Promise.reject(this.normalizeError(error))
      },
    )
  }

  /**
   * Normalize API errors into a consistent format
   */
  private normalizeError(error: AxiosError): ApiError {
    const apiError: ApiError = new Error(
      error.response?.data?.message || error.message || 'Unknown API Error',
    )

    // Add additional properties for better error handling
    apiError.status = error.response?.status
    apiError.data = error.response?.data
    apiError.code = error.response?.data?.code || error.code
    apiError.isNetworkError = error.message === 'Network Error'
    apiError.isTimeout = error.code === 'ECONNABORTED'
    apiError.originalError = error

    // Log error for development
    if (__DEV__) {
      console.error('API ERROR:', {
        url: error.config?.url,
        status: error.response?.status,
        message: apiError.message,
        data: error.response?.data,
      })
    }

    return apiError
  }

  /**
   * Refresh authentication token
   */
  private async refreshToken(): Promise<string> {
    const refreshToken = await LocalStorage.getItem('refreshToken')
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await this.client.post('/auth/refresh', {refreshToken}, {skipAuth: true})

    const {accessToken, refreshToken: newRefreshToken} = response.data

    // Save the new tokens
    await LocalStorage.setItem('authToken', accessToken)
    await LocalStorage.setItem('refreshToken', newRefreshToken)

    return accessToken
  }

  /**
   * Check if the device is connected to the internet
   */
  private async isConnected(): Promise<boolean> {
    const netInfo = await NetInfo.fetch()
    return netInfo.isConnected === true
  }

  /**
   * Get cached data for a request if available
   */
  private getCachedData<T>(cacheKey: string): T | null {
    const cachedData = apiCache.getString(cacheKey)
    if (!cachedData) return null

    try {
      const {data, expiry} = JSON.parse(cachedData)

      // Check if cache is still valid
      if (expiry > Date.now()) {
        return data as T
      }

      // Clear expired cache
      apiCache.delete(cacheKey)
      return null
    } catch (e) {
      // If JSON parsing fails, delete the invalid cache
      apiCache.delete(cacheKey)
      return null
    }
  }

  /**
   * Cache API response data
   */
  private setCacheData(cacheKey: string, data: unknown, cacheTime: number): void {
    const cacheData = {
      data,
      expiry: Date.now() + cacheTime,
    }

    apiCache.set(cacheKey, JSON.stringify(cacheData))
  }

  /**
   * Create a cache key for a request
   */
  private createCacheKey(method: ApiMethod, url: string, params?: unknown): string {
    return `${method}:${url}:${params ? JSON.stringify(params) : ''}`
  }

  /**
   * Execute an API request with retries and caching
   */
  private async request<T>(
    method: ApiMethod,
    url: string,
    data?: unknown,
    config: ApiRequestConfig = {},
  ): Promise<T> {
    return Performance.measureAsync(
      async () => {
        const {
          skipCache = false,
          cacheTime = 5 * 60 * 1000, // Default 5 minutes
          retries = MAX_RETRIES,
          mockData,
          ...axiosConfig
        } = config

        // Return mock data if provided (useful for testing or development)
        if (mockData !== undefined) {
          // Simulate network delay
          if (__DEV__) {
            await new Promise(resolve => setTimeout(resolve, 200))
          }
          return mockData as T
        }

        // For GET requests, try to use cached data
        const isGet = method === 'GET'
        const cacheKey = this.createCacheKey(method, url, isGet ? data : undefined)

        if (isGet && !skipCache) {
          const cachedData = this.getCachedData<T>(cacheKey)
          if (cachedData) {
            return cachedData
          }
        }

        // Check network connectivity
        const isConnected = await this.isConnected()
        if (!isConnected) {
          throw new Error('No internet connection')
        }

        // Set up retry logic
        let lastError: ApiError
        let attempts = 0

        while (attempts <= retries) {
          try {
            attempts++

            // Make the actual API request
            const response = await this.client.request<T>({
              method,
              url,
              params: isGet ? data : undefined,
              data: !isGet ? data : undefined,
              ...axiosConfig,
            })

            // Cache successful GET responses
            if (isGet && !skipCache && response.data) {
              this.setCacheData(cacheKey, response.data, cacheTime)
            }

            return response.data
          } catch (error) {
            lastError = error as ApiError

            // Don't retry for client errors (4xx) except for 401
            if (
              lastError.status &&
              lastError.status >= 400 &&
              lastError.status < 500 &&
              lastError.status !== 401
            ) {
              break
            }

            // If we've reached max retries, throw the error
            if (attempts > retries) {
              break
            }

            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempts))
          }
        }

        throw lastError!
      },
      `API_${method}_${url.replace(/[^a-zA-Z0-9]/g, '_')}`,
    )
  }

  // Public API methods
  public async get<T>(url: string, params?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('GET', url, params, config)
  }

  public async post<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('POST', url, data, config)
  }

  public async put<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('PUT', url, data, config)
  }

  public async patch<T>(url: string, data?: unknown, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('PATCH', url, data, config)
  }

  public async delete<T>(url: string, config?: ApiRequestConfig): Promise<T> {
    return this.request<T>('DELETE', url, undefined, config)
  }

  /**
   * Clear all cached API responses
   */
  public clearCache(): void {
    const allKeys = apiCache.getAllKeys()
    allKeys.forEach(key => apiCache.delete(key))
  }

  /**
   * Clear specific cached API response
   */
  public clearCacheForUrl(method: ApiMethod, url: string, params?: unknown): void {
    const cacheKey = this.createCacheKey(method, url, params)
    apiCache.delete(cacheKey)
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient()
export default apiClient
