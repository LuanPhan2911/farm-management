import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { getEquipmentUsagesByActivityId } from "@/services/equipment-usages";

import { getCurrentStaff } from "@/services/staffs";
import { notFound } from "next/navigation";
import { getActivityById } from "@/services/activities";
import { canUpdateActivityStatus } from "@/lib/permission";
import { ActivityEquipmentUsageCreateButton } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/equipment-usages/_components/activity-equipment-usage-create-button";
import { ActivityEquipmentUsagesTable } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/equipment-usages/_components/activity-equipment-usages-table";
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
  const t = await getTranslations(
    "crops.page.detail.activities.detail.equipment-usages"
  );
  const { query, orderBy } = searchParams;

  const data = await getEquipmentUsagesByActivityId({
    activityId: params.activityId,
    orderBy,
    query,
  });

  const activity = await getActivityById(params.activityId);
  if (!activity) {
    notFound();
  }
  const canUpdate = canUpdateActivityStatus(activity.status);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <ActivityEquipmentUsageCreateButton disabled={!canUpdate} />
        </div>
        <ActivityEquipmentUsagesTable data={data} />
      </CardContent>
    </Card>
  );
};
export default ActivityEquipmentUsagesPage;
