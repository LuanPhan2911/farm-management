import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getEquipmentUsagesByActivity } from "@/services/equipment-usages";
import { EquipmentUsageCreateButton } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/details/[equipmentDetailId]/usages/_components/equipment-usage-create-button";
import { getActivityById } from "@/services/activities";
import { notFound } from "next/navigation";
import { canUpdateActivityStatus, canUpdateCropStatus } from "@/lib/permission";
import { ActivityEquipmentUsagesTable } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/equipment-usages/_components/activity-equipment-usages-table";
import { getCurrentStaffRole } from "@/services/staffs";
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

  const data = await getEquipmentUsagesByActivity({
    activityId: params.activityId,
    orderBy,
    query,
  });

  const activity = await getActivityById(params.activityId);
  if (!activity) {
    notFound();
  }
  const { isOnlyAdmin } = await getCurrentStaffRole();

  const canManage =
    isOnlyAdmin &&
    canUpdateCropStatus(activity.crop.status) &&
    canUpdateActivityStatus(activity.status);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <EquipmentUsageCreateButton canCreate={canManage} />
        </div>
        <ActivityEquipmentUsagesTable data={data} canEdit={canManage} />
      </CardContent>
    </Card>
  );
};
export default CropActivityEquipmentUsagesPage;
