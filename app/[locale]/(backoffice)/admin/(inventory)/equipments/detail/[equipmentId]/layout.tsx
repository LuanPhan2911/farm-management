import { PropsWithChildren } from "react";
import { EquipmentNavigationMenu } from "../../_components/equipment-navigation-menu";

interface EquipmentDetailLayoutProps extends PropsWithChildren {}
const EquipmentDetailLayout = ({ children }: EquipmentDetailLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <EquipmentNavigationMenu />
      {children}
    </div>
  );
};

export default EquipmentDetailLayout;
