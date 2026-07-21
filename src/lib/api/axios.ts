import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getTenantSlug } from '@/lib/tenant';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  originalRequest: InternalAxiosRequestConfig;
}> = [];

const flushRefreshQueue = (error?: unknown) => {
  refreshQueue.forEach(({ resolve, reject, originalRequest }) => {
    if (error) {
      reject(error);
    } else {
      resolve(api(originalRequest));
    }
  });
  refreshQueue = [];
};

const unwrapApiResponse = <T>(payload: unknown): T => {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const maybeWrapped = payload as { data?: T };
    if (maybeWrapped.data !== undefined) {
      return maybeWrapped.data as T;
    }
  }

  return payload as T;
};

const showUnauthorizedToast = () => {
  const existingToast = document.getElementById('auth-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'auth-toast';
  toast.className = 'fixed right-4 top-4 z-[9999] rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-lg';
  toast.textContent = 'Your session expired. Please sign in again.';
  document.body.appendChild(toast);

  window.setTimeout(() => toast.remove(), 3500);
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers['X-Tenant-Slug'] = getTenantSlug();
  return config;
});

api.interceptors.response.use(
  (response) => {
    response.data = unwrapApiResponse(response.data);
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
  const authPath = originalRequest.url ? String(originalRequest.url) : '';
  const isAuthEndpoint = authPath.includes('/auth/login') || authPath.includes('/auth/refresh');
  const shouldAttemptRefresh =
    error.response?.status === 401 &&
    !originalRequest._retry &&
    !isAuthEndpoint;

  if (shouldAttemptRefresh) {
    originalRequest._retry = true;

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const response = await api.post(
          '/auth/refresh',
          {},
          {
            headers: {
              'X-Tenant-Slug': getTenantSlug(),
            },
          },
        );

        const nextAccessToken = response.data?.accessToken;
        const nextRefreshToken = response.data?.refreshToken;

        if (nextAccessToken) {
          localStorage.setItem('accessToken', nextAccessToken);
          if (nextRefreshToken) {
            try {
              localStorage.setItem('refreshToken', nextRefreshToken);
            } catch {}
          }
          flushRefreshQueue();
        } else {
          throw new Error('Refresh response missing access token');
        }
      } catch (refreshError) {
        showUnauthorizedToast();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        flushRefreshQueue(refreshError);
        window.location.href = '/login';
        throw refreshError;
      } finally {
        isRefreshing = false;
      }
    }

    return new Promise((resolve, reject) => {
      refreshQueue.push({
        resolve,
        reject,
        originalRequest,
      });
    });
  }

    return Promise.reject(error);
  }
);

export default api;
