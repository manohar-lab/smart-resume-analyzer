import axios, { AxiosInstance, AxiosError } from 'axios';
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  User,
  Analysis,
  AnalysisRequest,
  InterviewQuestionsResponse,
  SkillDetected,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Try to refresh token
          const refreshToken = this.getRefreshToken();
          if (refreshToken) {
            try {
              await this.refreshAccessToken(refreshToken);
              // Retry original request
              return this.client.request(error.config!);
            } catch (refreshError) {
              // Refresh failed, clear auth
              this.clearTokens();
              window.location.href = '/login';
            }
          }
        }
        return Promise.reject(error);
      }
    );

    // Load tokens from localStorage
    this.accessToken = this.getAccessToken();
  }

  // ============== TOKEN MANAGEMENT ==============

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    this.accessToken = accessToken;
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    this.accessToken = null;
  }

  // ============== AUTHENTICATION ==============

  async register(data: RegisterRequest): Promise<TokenResponse> {
    const response = await this.client.post<TokenResponse>('/auth/register', data);
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await this.client.post<TokenResponse>('/auth/login', data);
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await this.client.post('/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
    const response = await this.client.post<TokenResponse>('/auth/refresh', {
      refreshToken,
    });
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me');
    return response.data;
  }

  // ============== ANALYSIS ==============

  async createAnalysis(data: AnalysisRequest): Promise<Analysis> {
    const response = await this.client.post<Analysis>('/analysis', data);
    return response.data;
  }

  async getAnalysis(analysisId: string): Promise<Analysis> {
    const response = await this.client.get<Analysis>(`/analysis/${analysisId}`);
    return response.data;
  }

  async getAnalysisSkills(analysisId: string): Promise<SkillDetected[]> {
    const response = await this.client.get<SkillDetected[]>(
      `/analysis/${analysisId}/skills`
    );
    return response.data;
  }

  async deleteAnalysis(analysisId: string): Promise<void> {
    await this.client.delete(`/analysis/${analysisId}`);
  }

  // ============== INTERVIEW ==============

  async getInterviewQuestions(analysisId: string): Promise<InterviewQuestionsResponse> {
    const response = await this.client.get<InterviewQuestionsResponse>(
      `/analysis/${analysisId}/interview-questions`
    );
    return response.data;
  }

  // ============== ERROR HANDLING ==============

  getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
      return error.response?.data?.detail || error.message || 'An error occurred';
    }
    return 'An unexpected error occurred';
  }
}

export const apiService = new ApiService();
