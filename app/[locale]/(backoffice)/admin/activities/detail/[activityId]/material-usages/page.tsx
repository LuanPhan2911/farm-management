import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { getMaterialUsagesByActivityId } from "@/services/material-usages";
import { ActivityMaterialUsageCreateButton } from "./_components/activity-material-usage-create-button";
import { ActivityMaterialUsagesTable } from "./_components/activity-material-usages-table";
import { getActivityById } from "@/services/activities";
import { getCurrentStaff } from "@/services/staffs";
import { notFound } from "next/navigation";
import { canUpdateActivityStatus } from "@/lib/permission";
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

  const activity = await getActivityById(params.activityId);
  if (!activity) {
    notFound();
  }
  const materials = await getMaterialUsagesByActivityId({
    activityId: params.activityId,
    orderBy,
    query,
  });
  const canUpdate = canUpdateActivityStatus(activity.status);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <ActivityMaterialUsageCreateButton disabled={!canUpdate} />
        </div>
        <ActivityMaterialUsagesTable data={materials} />
      </CardContent>
    </Card>
  );
};
export default ActivityMaterialUsagesPage;
