import { SocketProvider } from "@/components/providers/socket-provider";
import { PropsWithChildren } from "react";

interface OrganizationDetailLayoutProps extends PropsWithChildren {}
const OrganizationDetailLayout = async ({
  children,
}: OrganizationDetailLayoutProps) => {
  return <SocketProvider>{children}</SocketProvider>;
};

export default OrganizationDetailLayout;
