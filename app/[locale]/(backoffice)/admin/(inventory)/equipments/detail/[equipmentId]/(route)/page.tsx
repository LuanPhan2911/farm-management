import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { EquipmentEditForm } from "../../../_components/equipment-edit-button";
import { getEquipmentById } from "@/services/equipments";
import { notFound } from "next/navigation";

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
