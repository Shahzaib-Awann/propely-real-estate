import { create } from "zustand";

interface PresenceState {
  onlineUserIds: string[];
  setOnlineUsers: (userIds: string[]) => void;
  isUserOnline: (userId: string | number) => boolean;
}

export const usePresenceStore = create<PresenceState>((set, get) => ({
  onlineUserIds: [],
  setOnlineUsers: (userIds) => set({ onlineUserIds: userIds.map(String) }),
  isUserOnline: (userId) => {
    if (!userId) return false;
    return get().onlineUserIds.includes(String(userId));
  },
}));