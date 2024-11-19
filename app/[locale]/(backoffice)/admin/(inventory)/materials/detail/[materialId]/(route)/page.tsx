import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMaterialById } from "@/services/materials";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { MaterialEditForm } from "../../../_components/material-edit-button";

export async function generateMetadata() {
  const t = await getTranslations("materials.page.detail");
  return {
    title: t("title"),
  };
}

interface MaterialDetailPageProps {
  params: {
    materialId: string;
  };
}
const MaterialDetailPage = async ({ params }: MaterialDetailPageProps) => {
  const data = await getMaterialById(params!.materialId);

  const t = await getTranslations("materials.page.detail");
  if (!data) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <MaterialEditForm data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialDetailPage;
