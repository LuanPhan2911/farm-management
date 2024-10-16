import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { getEquipmentDetails } from "@/services/equipment-details";
import { EquipmentDetailCreateButton } from "./_components/equipment-detail-create-button";
import { EquipmentDetailsTable } from "./_components/equipment-details-data-table";

interface EquipmentDetailPageProps {
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

const EquipmentDetailPage = async ({ params }: EquipmentDetailPageProps) => {
  const data = await getEquipmentDetails({
    equipmentId: params.equipmentId,
  });
  const t = await getTranslations("equipmentDetails.page");

  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <EquipmentDetailCreateButton />
          </div>
          <EquipmentDetailsTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentDetailPage;
