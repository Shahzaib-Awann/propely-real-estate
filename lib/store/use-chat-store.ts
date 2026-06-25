import { create } from "zustand";

interface ChatState {
  totalUnreadCount: number;
  setTotalUnreadCount: (count: number) => void;
  updateTotalUnreadCount: (delta: number) => void;
  reduceUnreadCount: (amount: number) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  totalUnreadCount: 0, // Fallback default initial value
  setTotalUnreadCount: (count) => set({ totalUnreadCount: count }),
  updateTotalUnreadCount: (delta) =>
    set((state) => ({
      totalUnreadCount: Math.max(0, state.totalUnreadCount + delta),
    })),
  reduceUnreadCount: (amount) =>
    set((state) => ({
      totalUnreadCount: Math.max(0, state.totalUnreadCount - amount),
    })),
}));