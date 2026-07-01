import { create } from "zustand";



/**
 * Chat state structure.
 */
interface ChatState {
  totalUnreadCount: number;
  setTotalUnreadCount: (count: number) => void;
  updateTotalUnreadCount: (delta: number) => void;
  reduceUnreadCount: (amount: number) => void;
}



/**
 * === Chat State Store (Zustand) ===
 *
 * Manages global unread message count for chat UI.
 * Handles real-time updates and safe state changes.
 */
export const useChatStore = create<ChatState>((set) => ({
  totalUnreadCount: 0,

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
