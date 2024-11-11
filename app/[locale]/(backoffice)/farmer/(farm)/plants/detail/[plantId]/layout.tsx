import { PlantNavigationMenu } from "@/app/[locale]/(backoffice)/admin/(farm)/plants/_components/plant-navigation-menu";
import { PropsWithChildren } from "react";

const PlantDetailLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <PlantNavigationMenu />
      {children}
    </div>
  );
};

export default PlantDetailLayout;
