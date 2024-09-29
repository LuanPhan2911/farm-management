import { getFieldById, getFields } from "@/services/fields";
import { notFound } from "next/navigation";
import { FieldInfo } from "../../../_components/field-info";

import { getTranslations } from "next-intl/server";

interface FieldDetailPageProps {
  params: {
    fieldId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("fields.page.detail");
  return {
    title: t("title"),
  };
}
export const generateStaticParams = async () => {
  const fields = await getFields();
  return fields.map((field) => {
    return { fieldId: field.id };
  });
};
const FieldDetailPage = async ({ params }: FieldDetailPageProps) => {
  const field = await getFieldById(params.fieldId);

  if (!field) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <FieldInfo data={field} />
    </div>
  );
};

export default FieldDetailPage;
