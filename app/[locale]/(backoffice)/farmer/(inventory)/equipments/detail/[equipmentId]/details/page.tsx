import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { getEquipmentDetails } from "@/services/equipment-details";
import { getEquipmentById } from "@/services/equipments";
import { notFound } from "next/navigation";
import { EquipmentDetailsTable } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/_components/equipment-details-data-table";

interface EquipmentDetailsPageProps {
  params: {
    equipmentId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("equipmentDetails.page");
  return {
    title: t("title"),
  };
}

const EquipmentDetailsPage = async ({ params }: EquipmentDetailsPageProps) => {
  const data = await getEquipmentDetails({
    equipmentId: params.equipmentId,
  });
  const equipment = await getEquipmentById(params.equipmentId);
  const t = await getTranslations("equipmentDetails.page");
  if (!equipment) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <EquipmentDetailsTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentDetailsPage;
