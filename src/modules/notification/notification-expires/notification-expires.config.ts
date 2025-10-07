import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class NotificationExpiresConfig {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.EXPIRES_API_SERVICE_URL || 'http://localhost:8082',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(
          `[NotificationExpires] Request: ${config.method?.toUpperCase()} ${config.url}`,
        );
        return config;
      },
      (error) => {
        console.error('[NotificationExpires] Request Error:', error);
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return Promise.reject(error);
      },
    );

    this.axiosInstance.interceptors.response.use(
      (response) => {
        console.log(
          `[NotificationExpires] Response: ${response.status} ${response.config.url}`,
        );
        return response;
      },
      (error) => {
        console.error(
          '[NotificationExpires] Response Error:',
          error.response?.status,
          error.message,
        );
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
        return Promise.reject(error);
      },
    );
  }

  get(url: string, config?: any) {
    return this.axiosInstance.get(url, config);
  }

  post(url: string, data?: any, config?: any) {
    return this.axiosInstance.post(url, data, config);
  }

  put(url: string, data?: any, config?: any) {
    return this.axiosInstance.put(url, data, config);
  }

  delete(url: string, config?: any) {
    return this.axiosInstance.delete(url, config);
  }
}
