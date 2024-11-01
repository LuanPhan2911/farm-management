import { FieldNavigationMenu } from "@/app/[locale]/(backoffice)/admin/(farm)/fields/_components/field-navigation-menu";
import { PropsWithChildren } from "react";

interface FieldDetailLayoutProps extends PropsWithChildren {}
const FieldDetailLayout = ({ children }: FieldDetailLayoutProps) => {
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <FieldNavigationMenu />
      {children}
    </div>
  );
};

export default FieldDetailLayout;
