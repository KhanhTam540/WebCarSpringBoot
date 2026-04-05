import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CartState = {
  badgeCount: number;
  setBadgeCount: (count: number) => void;
  syncBadgeCountFromItems: (items: Array<{ quantity: number }>) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      badgeCount: 0,
      setBadgeCount: (count) => set({ badgeCount: count }),
      syncBadgeCountFromItems: (items) =>
        set({
          badgeCount: items.reduce((total, item) => total + item.quantity, 0),
        }),
      clear: () => set({ badgeCount: 0 }),
    }),
    {
      name: 'weboto-cart',
    }
  )
);
