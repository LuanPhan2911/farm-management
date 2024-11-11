import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getEquipmentUsagesByActivity } from "@/services/equipment-usages";
import { EquipmentUsageCreateButton } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/details/[equipmentDetailId]/usages/_components/equipment-usage-create-button";
import { getOnlyActivityById } from "@/services/activities";
import { notFound } from "next/navigation";
import { canUpdateActivityStatus } from "@/lib/permission";
import { ActivityEquipmentUsagesTable } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/equipment-usages/_components/activity-equipment-usages-table";
import { canUpdateActivity } from "@/lib/role";
export async function generateMetadata() {
  const t = await getTranslations("activities.page.detail.equipment-usages");
  return {
    title: t("title"),
  };
}

interface CropActivityEquipmentUsagesPageProps {
  params: {
    activityId: string;
    cropId: string;
  };
  searchParams: {
    query?: string;
    orderBy?: string;
  };
}
const CropActivityEquipmentUsagesPage = async ({
  params,
  searchParams,
}: CropActivityEquipmentUsagesPageProps) => {
  const t = await getTranslations(
    "crops.page.detail.activities.detail.equipment-usages"
  );
  const { query, orderBy } = searchParams;

  const { data, totalCost } = await getEquipmentUsagesByActivity({
    activityId: params.activityId,
    orderBy,
    query,
  });

  const canEdit = await canUpdateActivity(params.cropId, params.activityId);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <EquipmentUsageCreateButton disabled={!canEdit} />
        </div>
        <ActivityEquipmentUsagesTable
          data={data}
          totalCost={totalCost}
          disabled={!canEdit}
        />
      </CardContent>
    </Card>
  );
};
export default CropActivityEquipmentUsagesPage;
