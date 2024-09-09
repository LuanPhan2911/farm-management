import { PropsWithChildren } from "react";
import { FieldNavigationMenu } from "../../_components/field-navigation-menu";
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
