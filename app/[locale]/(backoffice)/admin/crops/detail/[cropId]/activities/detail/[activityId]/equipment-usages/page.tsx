import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getEquipmentUsagesByActivity } from "@/services/equipment-usages";
import { EquipmentUsageCreateButton } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/details/[equipmentDetailId]/usages/_components/equipment-usage-create-button";
import { EquipmentUsagesTable } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/details/[equipmentDetailId]/usages/_components/equipment-usages-table";
import { getActivityById } from "@/services/activities";
import { notFound } from "next/navigation";
import { canUpdateActivityStatus } from "@/lib/permission";
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

  const { data, totalCost } = await getEquipmentUsagesByActivity({
    activityId: params.activityId,
    orderBy,
    query,
  });
  const activity = await getActivityById(params.activityId);
  if (!activity) {
    notFound();
  }
  const canUpdateActivity = canUpdateActivityStatus(activity.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <EquipmentUsageCreateButton disabled={!canUpdateActivity} />
        </div>
        <EquipmentUsagesTable data={data} totalPage={0} totalCost={totalCost} />
      </CardContent>
    </Card>
  );
};
export default ActivityEquipmentUsagesPage;
