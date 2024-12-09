import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getMaterialUsagesByActivity } from "@/services/material-usages";
import { MaterialUsageCreateButton } from "../../../../(inventory)/materials/detail/[materialId]/usages/_components/material-usages-create-button";
import { getActivityById } from "@/services/activities";
import { notFound } from "next/navigation";
import { canUpdateActivityStatus, canUpdateCropStatus } from "@/lib/permission";
import { ActivityMaterialUsagesTable } from "./_components/activity-material-usages-table";
import { getCurrentStaffRole } from "@/services/staffs";
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

  const data = await getMaterialUsagesByActivity({
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
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <MaterialUsageCreateButton canCreate={canManage} />
        </div>
        <ActivityMaterialUsagesTable data={data} canEdit={canManage} />
      </CardContent>
    </Card>
  );
};
export default ActivityMaterialUsagesPage;
