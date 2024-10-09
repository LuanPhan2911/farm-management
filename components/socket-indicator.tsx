"use client";

import { useSocket } from "@/stores/use-socket";
import { Badge } from "./ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();
  if (!isConnected) {
    return <Badge variant={"edit"}>Fallback: Polling after 1s</Badge>;
  } else {
    return <Badge variant={"success"}>Live: Realtime updates</Badge>;
  }
};
