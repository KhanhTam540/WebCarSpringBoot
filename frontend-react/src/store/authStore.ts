import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AuthUser = {
  username: string;
  roles: string[];
};

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  cartBadgeCount: number;
  setSession: (payload: { accessToken: string; user: AuthUser }) => void;
  clearSession: () => void;
  setCartBadgeCount: (count: number) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      cartBadgeCount: 0,
      setSession: ({ accessToken, user }) =>
        set({
          accessToken,
          user,
        }),
      clearSession: () =>
        set({
          accessToken: null,
          user: null,
          cartBadgeCount: 0,
        }),
      setCartBadgeCount: (count) =>
        set({
          cartBadgeCount: count,
        }),
    }),
    {
      name: 'weboto-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
        cartBadgeCount: state.cartBadgeCount,
      }),
    },
  ),
);

export const selectIsAuthenticated = (state: AuthState) => Boolean(state.accessToken);

export const selectIsAdmin = (state: AuthState) =>
  Boolean(state.user?.roles.some((role) => role === 'ADMIN' || role === 'ROLE_ADMIN'));
