import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { getMaterialUsagesByActivityId } from "@/services/material-usages";
import { getActivityById } from "@/services/activities";
import { getCurrentStaff } from "@/services/staffs";
import { notFound } from "next/navigation";
import { canUpdateActivityStatus } from "@/lib/permission";
import { ActivityMaterialUsagesTable } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/material-usages/_components/activity-material-usages-table";
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
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  const activity = await getActivityById({
    activityId: params.activityId,
    staffId: currentStaff.id,
  });
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
        <ActivityMaterialUsagesTable data={materials} />
      </CardContent>
    </Card>
  );
};
export default ActivityMaterialUsagesPage;
