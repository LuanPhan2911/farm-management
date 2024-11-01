import { SocketProvider } from "@/components/providers/socket-provider";
import { PropsWithChildren } from "react";

interface MessagesLayoutProps extends PropsWithChildren {}
const MessagesLayout = ({ children }: MessagesLayoutProps) => {
  return <SocketProvider>{children}</SocketProvider>;
};

export default MessagesLayout;
