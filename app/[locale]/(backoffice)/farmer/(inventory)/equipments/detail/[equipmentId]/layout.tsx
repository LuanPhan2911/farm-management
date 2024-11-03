import { EquipmentNavigationMenu } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/_components/equipment-navigation-menu";
import { PropsWithChildren } from "react";

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
