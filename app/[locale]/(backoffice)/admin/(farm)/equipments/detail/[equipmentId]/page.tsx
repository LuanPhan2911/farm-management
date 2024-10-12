import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { getEquipmentDetails } from "@/services/equipment-details";

interface EquipmentDetailPageProps {
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

const EquipmentDetailPage = async ({ params }: EquipmentDetailPageProps) => {
  const data = await getEquipmentDetails({
    equipmentId: params.equipmentId,
  });
  const t = await getTranslations("equipments.page.edit");

  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default EquipmentDetailPage;
