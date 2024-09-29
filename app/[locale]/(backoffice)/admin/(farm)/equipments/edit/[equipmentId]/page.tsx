import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEquipmentById, getEquipmentsSelect } from "@/services/equipments";

import { notFound } from "next/navigation";
import { EquipmentEditForm } from "../../_components/equipment-edit-button";
import { getTranslations } from "next-intl/server";

interface EquipmentEditPageProps {
  params: {
    equipmentId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("equipments.page.edit");
  return {
    title: t("title"),
  };
}

export async function generateStaticParams() {
  const equipments = await getEquipmentsSelect();
  return equipments.map((item) => {
    return {
      equipmentId: item.id,
    };
  });
}

const EquipmentEditPage = async ({ params }: EquipmentEditPageProps) => {
  const data = await getEquipmentById(params.equipmentId);
  const t = await getTranslations("equipments.page.edit");
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

export default EquipmentEditPage;
