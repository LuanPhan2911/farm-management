import { PropsWithChildren } from "react";
import { MaterialNavigationMenu } from "../../_components/material-navigation-menu";
interface MaterialDetailLayoutProps extends PropsWithChildren {}
const MaterialDetailLayout = ({ children }: MaterialDetailLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <MaterialNavigationMenu />
      {children}
    </div>
  );
};

export default MaterialDetailLayout;
