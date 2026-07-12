import api from '../../lib/api/axios';
import { getTenantSlug } from '../../lib/tenant';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
  tenantSlug?: string;
  name?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface ProfileResponse extends AuthUser {}

function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object') {
    const maybe = error as { response?: { data?: { message?: string } }; message?: string };
    if (maybe.response?.data?.message) return maybe.response.data.message;
    if (maybe.message) return maybe.message;
  }
  return 'Authentication failed';
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const response = await api.post<LoginResponse>('/auth/login', payload, {
        headers: {
          'X-Tenant-Slug': getTenantSlug(),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await api.get<ProfileResponse>('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(extractErrorMessage(error));
    }
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // swallow logout errors and clear client state anyway
      console.warn('Logout request failed', extractErrorMessage(error));
    }
  },
};
