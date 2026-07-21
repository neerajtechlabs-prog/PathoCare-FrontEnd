import api from '../../lib/api/axios';
import { getTenantSlug } from '../../lib/tenant';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  tenantName?: string;
  labName?: string;
  labCode?: string;
  registrationNumber?: string;
  gstNumber?: string;
  mobileNumber?: string;
  designation?: string;
  username?: string;
  country?: string;
  state?: string;
  city?: string;
  pinCode?: string;
  completeAddress?: string;
  plan?: string;
  terms?: boolean;
  privacy?: boolean;
  tenantSlug?: string;
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

export interface SignupResponse {
  message: string;
  user: AuthUser;
  password?: string;
}

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

  async signup(payload: SignupPayload): Promise<SignupResponse> {
    try {
      const response = await api.post<SignupResponse>('/auth/signup', payload, {
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
