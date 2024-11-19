import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { canGetField } from "@/lib/role";
import { FieldEditLocationForm } from "../../../_components/field-edit-loction-form";
import { getFieldLocations } from "@/services/fields";

interface FieldDetailPageProps {
  params: {
    fieldId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("fields.page.detail.locations");
  return {
    title: t("title"),
  };
}

const FieldLocationPage = async ({ params }: FieldDetailPageProps) => {
  const data = await canGetField(params!.fieldId);
  const locations = await getFieldLocations();
  const t = await getTranslations("fields.tabs");
  if (!data) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("locations.title")}</CardTitle>
          <CardDescription>{t("locations.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldEditLocationForm data={data} locations={locations} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldLocationPage;
