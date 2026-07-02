import axios from 'axios';
import { getTenantSlug } from '@/lib/tenant';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers['X-Tenant-Slug'] = getTenantSlug();
  return config;
});

export default api;
