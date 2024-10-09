import { create } from "zustand";

interface SocketData {
  socket: any | null;
  isConnected: boolean;
  onConnect: (socket: any | null) => void;
  onDisconnect: () => void;
}

export const useSocket = create<SocketData>((set) => {
  return {
    isConnected: false,
    socket: null,
    onConnect: (socket) => set({ socket, isConnected: true }),
    onDisconnect: () => set({ socket: null, isConnected: false }),
  };
});
