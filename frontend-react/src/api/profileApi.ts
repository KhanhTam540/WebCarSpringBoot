import { httpClient } from './httpClient';

export type ProfileResponse = {
  username: string;
  email: string;
  roles: string[];
};

export const profileApi = {
  getProfile: () => httpClient<ProfileResponse>({ path: '/users/profile', method: 'GET' }),
  sendOtpForProfile: () => httpClient<string>({ path: '/users/send-otp-profile', method: 'POST' }),
  verifyChangeEmail: (payload: { otpCode: string; newEmail: string }) =>
    httpClient<string>({ path: '/users/verify-change-email', method: 'POST', body: JSON.stringify(payload) }),
  verifyChangePassword: (payload: { otpCode: string; newPassword: string }) =>
    httpClient<string>({ path: '/users/verify-change-password', method: 'POST', body: JSON.stringify(payload) }),
};
