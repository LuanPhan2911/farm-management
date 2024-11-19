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
import { canGetField } from "@/lib/role";

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

const FieldDetailPage = async ({ params }: FieldDetailPageProps) => {
  const data = await canGetField(params!.fieldId);
  const t = await getTranslations("fields.tabs");
  if (!data) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("info.title")}</CardTitle>
          <CardDescription>{t("info.description")}</CardDescription>
          <h3 className="text-lg font-semibold">{data.name}</h3>
        </CardHeader>
        <CardContent>
          <FieldEditForm data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldDetailPage;
