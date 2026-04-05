import { getApiBaseUrl } from '../lib/env';
import { useAuthStore } from '../store/authStore';

type RequestOptions = RequestInit & {
  path: string;
};

async function readResponseBody(response: Response) {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  return response.text();
}

export async function httpClient<T>({ path, headers, ...init }: RequestOptions): Promise<T> {
  const { accessToken, clearSession } = useAuthStore.getState();

  const resolvedHeaders = {
    ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...headers,
  };

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: resolvedHeaders,
  });

  if (response.status === 401) {
    clearSession();
  }

  if (!response.ok) {
    const body = await readResponseBody(response);
    const message =
      typeof body === 'object' && body !== null && 'message' in body && typeof body.message === 'string'
        ? body.message
        : typeof body === 'string' && body.trim()
          ? body
          : `HTTP ${response.status}`;

    throw new Error(message);
  }

  return (await readResponseBody(response)) as T;
}
