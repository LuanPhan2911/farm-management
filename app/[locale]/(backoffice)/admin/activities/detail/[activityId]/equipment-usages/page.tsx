import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { EquipmentUsageCreateButton } from "../../../../(inventory)/equipments/detail/[equipmentId]/details/[equipmentDetailId]/usages/_components/equipment-usage-create-button";
import { getEquipmentUsagesByActivity } from "@/services/equipment-usages";
import { getOnlyActivityById } from "@/services/activities";
import { canUpdateActivityStatus } from "@/lib/permission";
import { notFound } from "next/navigation";
import { ActivityEquipmentUsagesTable } from "./_components/activity-equipment-usages-table";
import { canUpdateActivity } from "@/lib/role";
export async function generateMetadata() {
  const t = await getTranslations("activities.page.detail.equipment-usages");
  return {
    title: t("title"),
  };
}

interface ActivityEquipmentUsagesPageProps {
  params: {
    activityId: string;
  };
  searchParams: {
    query?: string;
    orderBy?: string;
  };
}
const ActivityEquipmentUsagesPage = async ({
  params,
  searchParams,
}: ActivityEquipmentUsagesPageProps) => {
  const t = await getTranslations("activities.page.detail.equipment-usages");
  const { query, orderBy } = searchParams;

  const { data, totalCost } = await getEquipmentUsagesByActivity({
    activityId: params.activityId,
    orderBy,
    query,
  });
  const activity = await getOnlyActivityById(params.activityId);
  if (!activity) {
    notFound();
  }
  const canEdit = await canUpdateActivity(activity.cropId, params.activityId);

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
export default ActivityEquipmentUsagesPage;
