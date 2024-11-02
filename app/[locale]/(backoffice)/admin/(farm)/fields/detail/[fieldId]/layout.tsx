import { PropsWithChildren } from "react";
import { FieldNavigationMenu } from "../../_components/field-navigation-menu";
import { getFieldById } from "@/services/fields";
interface FieldDetailLayoutProps extends PropsWithChildren {
  params: {
    fieldId: string;
  };
}
const FieldDetailLayout = async ({
  children,
  params,
}: FieldDetailLayoutProps) => {
  const field = await getFieldById(params.fieldId);

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <FieldNavigationMenu data={field} />
      {children}
    </div>
  );
};

export default FieldDetailLayout;
