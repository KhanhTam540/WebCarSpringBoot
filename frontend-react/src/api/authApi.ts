import { httpClient } from './httpClient';

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export const authApi = {
  login: (payload: LoginRequest) =>
    httpClient<LoginResponse>({ path: '/auth/login', method: 'POST', body: JSON.stringify(payload) }),
  register: (payload: RegisterRequest) =>
    httpClient<string>({ path: '/auth/register', method: 'POST', body: JSON.stringify(payload) }),
  verifyOtp: ({ username, code }: { username: string; code: string }) =>
    httpClient<string>({
      path: `/auth/verify-otp?username=${encodeURIComponent(username)}&code=${encodeURIComponent(code)}`,
      method: 'POST',
    }),
};
