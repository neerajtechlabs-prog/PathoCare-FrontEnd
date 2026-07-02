export function getTenantSlug(): string {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname;

  if (hostname === 'localhost') return import.meta.env.VITE_DEV_TENANT ?? 'demo';

  const parts = hostname.split('.');
  return parts[0] ?? 'demo';
}
