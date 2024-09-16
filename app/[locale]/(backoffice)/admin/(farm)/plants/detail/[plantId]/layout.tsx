import { PropsWithChildren } from "react";
import { PlantNavigationMenu } from "../../_components/plant-navigation-menu";

const PlantDetailLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <PlantNavigationMenu />
      {children}
    </div>
  );
};

export default PlantDetailLayout;
