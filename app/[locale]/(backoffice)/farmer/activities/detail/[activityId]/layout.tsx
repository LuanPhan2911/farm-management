import { ActivityNavigationMenu } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-navigation-menu";
import { PropsWithChildren } from "react";

interface ActivityDetailLayoutProps extends PropsWithChildren {}
const ActivityDetailLayout = ({ children }: ActivityDetailLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <ActivityNavigationMenu />
      {children}
    </div>
  );
};

export default ActivityDetailLayout;
