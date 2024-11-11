import { PropsWithChildren } from "react";
import { CropNavigationMenu } from "../../_components/crop-navigation-menu";

interface CropDetailLayoutProps extends PropsWithChildren {}
const CropDetailLayout = ({ children }: CropDetailLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <CropNavigationMenu />
      {children}
    </div>
  );
};

export default CropDetailLayout;
