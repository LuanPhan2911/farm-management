"use client";
import { useSocket } from "@/stores/use-socket";
import { useEffect } from "react";
import { io as ClientIo } from "socket.io-client";

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { onConnect, onDisconnect } = useSocket();

  useEffect(() => {
    const socketInstance = new (ClientIo as any)({
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketInstance.on("connect", () => {
      onConnect(socketInstance);
    });
    socketInstance.on("disconnect", () => {
      onDisconnect();
    });

    return () => {
      socketInstance.disconnect();
      onDisconnect();
    };
  }, [onConnect, onDisconnect]);
  return children;
};
