import { PropsWithChildren } from "react";
import { ActivityNavigationMenu } from "../../_components/activity-navigation-menu";
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
