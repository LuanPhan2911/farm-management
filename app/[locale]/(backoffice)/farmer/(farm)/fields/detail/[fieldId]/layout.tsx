import { PropsWithChildren } from "react";

import { getFieldById } from "@/services/fields";
import { FieldNavigationMenu } from "@/app/[locale]/(backoffice)/admin/(farm)/fields/_components/field-navigation-menu";
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
