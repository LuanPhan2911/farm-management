import { MaterialNavigationMenu } from "@/app/[locale]/(backoffice)/admin/(inventory)/materials/_components/material-navigation-menu";
import { PropsWithChildren } from "react";

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
