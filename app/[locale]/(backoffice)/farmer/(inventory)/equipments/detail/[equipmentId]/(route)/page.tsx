import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getEquipmentById } from "@/services/equipments";
import { notFound } from "next/navigation";
import { EquipmentEditForm } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/_components/equipment-edit-button";

interface EquipmentDetailPageProps {
  params: {
    equipmentId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("equipments.page.detail");
  return {
    title: t("title"),
  };
}

const EquipmentDetailPage = async ({ params }: EquipmentDetailPageProps) => {
  const data = await getEquipmentById(params.equipmentId);

  const t = await getTranslations("equipments.page.detail");
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
          <EquipmentEditForm data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentDetailPage;
