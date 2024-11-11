import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getEquipmentUsagesByActivity } from "@/services/equipment-usages";
import { ActivityEquipmentUsagesTable } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/equipment-usages/_components/activity-equipment-usages-table";
import { getOnlyActivityById } from "@/services/activities";
import { notFound } from "next/navigation";
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
