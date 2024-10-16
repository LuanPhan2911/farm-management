import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMaterialById, getMaterialsSelect } from "@/services/materials";

import { notFound } from "next/navigation";
import { MaterialEditForm } from "../../_components/material-edit-button";
import { getTranslations } from "next-intl/server";

interface MaterialEditPageProps {
  params: {
    materialId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("materials.page.edit");
  return {
    title: t("title"),
  };
}

export async function generateStaticParams() {
  const materials = await getMaterialsSelect();
  return materials.map((item) => {
    return {
      materialId: item.id,
    };
  });
}

const MaterialEditPage = async ({ params }: MaterialEditPageProps) => {
  const data = await getMaterialById(params!.materialId);
  const t = await getTranslations("materials.page.edit");
  if (!data) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
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

export default MaterialEditPage;
