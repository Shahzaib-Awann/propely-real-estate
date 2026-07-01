import { create } from "zustand";



/**
 * Presence state shape.
 */
interface PresenceState {
  onlineUserIds: string[];
  setOnlineUsers: (userIds: string[]) => void;
  isUserOnline: (userId: string | number) => boolean;
}



/**
 * === User Presence Store (Zustand) ===
 *
 * Manages real-time online/offline user status.
 * Used for presence indicators in the UI.
 */
export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineUserIds: [],

  setOnlineUsers: (userIds) => set({ onlineUserIds: userIds.map(String) }),

  isUserOnline: (userId) => {
    if (!userId) return false;
    return get().onlineUserIds.includes(String(userId));
  },
}));