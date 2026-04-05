const FALLBACK_API_BASE_URL = '/api/v1';

export function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL?.trim() || FALLBACK_API_BASE_URL;
}
