import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getMaterialUsagesByActivity } from "@/services/material-usages";
import { MaterialUsageCreateButton } from "../../../../(inventory)/materials/detail/[materialId]/usages/_components/material-usages-create-button";
import { getOnlyActivityById } from "@/services/activities";
import { notFound } from "next/navigation";
import { canUpdateActivityStatus } from "@/lib/permission";
import { ActivityMaterialUsagesTable } from "./_components/activity-material-usages-table";
import { canUpdateActivity } from "@/lib/role";
export async function generateMetadata() {
  const t = await getTranslations("activities.page.detail.material-usages");
  return {
    title: t("title"),
  };
}

interface MaterialUsagesPageProps {
  params: {
    activityId: string;
  };
  searchParams: {
    query?: string;
    orderBy?: string;
  };
}
const ActivityMaterialUsagesPage = async ({
  params,
  searchParams,
}: MaterialUsagesPageProps) => {
  const t = await getTranslations("activities.page.detail.material-usages");
  const { query, orderBy } = searchParams;

  const { data, totalCost } = await getMaterialUsagesByActivity({
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
          <MaterialUsageCreateButton disabled={!canEdit} />
        </div>
        <ActivityMaterialUsagesTable
          data={data}
          totalCost={totalCost}
          disabled={!canEdit}
        />
      </CardContent>
    </Card>
  );
};
export default ActivityMaterialUsagesPage;
