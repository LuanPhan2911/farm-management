import { getActivityByIdWithCountUsage } from "@/services/activities";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { canUpdateActivityStatus, canUpdateCropStatus } from "@/lib/permission";
import { ActivityDangerCard } from "./_components/activity-danger-card";
import { getCurrentStaffRole } from "@/services/staffs";

interface ActivityDangerPageProps {
  params: {
    activityId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("activities.page.detail.danger");
  return {
    title: t("title"),
  };
}

const ActivityDangerPage = async ({ params }: ActivityDangerPageProps) => {
  const data = await getActivityByIdWithCountUsage(params.activityId);
  if (!data) {
    notFound();
  }

  const { isOnlyAdmin } = await getCurrentStaffRole();

  const canEdit =
    isOnlyAdmin &&
    canUpdateCropStatus(data.crop.status) &&
    canUpdateActivityStatus(data.status);

  const canDelete =
    data._count.equipmentUseds === 0 &&
    data._count.materialUseds === 0 &&
    canEdit;
  return (
    <ActivityDangerCard
      id={data.id}
      canDelete={canDelete}
      canEdit={canEdit}
      redirectUrl={`/activities`}
    />
  );
};
export default ActivityDangerPage;
