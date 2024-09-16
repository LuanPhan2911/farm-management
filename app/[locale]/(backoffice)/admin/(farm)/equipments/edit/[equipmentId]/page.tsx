import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEquipmentById } from "@/services/equipments";

import { notFound } from "next/navigation";
import { EquipmentEditForm } from "../../_components/equipment-edit-button";
import { getTranslations } from "next-intl/server";

interface EquipmentEditPageProps {
  params: {
    equipmentId: string;
  };
}
const EquipmentEditPage = async ({ params }: EquipmentEditPageProps) => {
  const data = await getEquipmentById(params.equipmentId);
  const t = await getTranslations("equipments.form");
  if (!data) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("edit.title")}</CardTitle>
          <CardDescription>{t("edit.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentEditForm data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentEditPage;
