import { create } from 'zustand';

type CompareState = {
  partIds: number[];
  togglePart: (partId: number) => void;
  clear: () => void;
};

export const useCompareStore = create<CompareState>((set) => ({
  partIds: [],
  togglePart: (partId) =>
    set((state) => {
      const exists = state.partIds.includes(partId);

      if (exists) {
        return { partIds: state.partIds.filter((id) => id !== partId) };
      }

      if (state.partIds.length >= 2) {
        return state;
      }

      return { partIds: [...state.partIds, partId] };
    }),
  clear: () => set({ partIds: [] }),
}));
