import { getFieldById, getFieldsSelect } from "@/services/fields";
import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { FieldEditForm } from "../../../_components/field-edit-button";

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
export async function generateStaticParams() {
  const plants = await getFieldsSelect();
  return plants.map((item) => {
    return {
      fieldId: item.id,
    };
  });
}
const FieldDetailPage = async ({ params }: FieldDetailPageProps) => {
  const data = await getFieldById(params!.fieldId);
  const t = await getTranslations("fields.tabs");
  if (!data) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card className="grid grid-cols-1 lg:grid-cols-5 p-6">
        <CardHeader className="lg:col-span-1">
          <CardTitle>{t("info.title")}</CardTitle>
          <CardDescription>{t("info.description")}</CardDescription>
          <h3 className="text-lg font-semibold">{data.name}</h3>
        </CardHeader>
        <CardContent className="lg:col-span-4">
          <FieldEditForm data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldDetailPage;
