import { getActivityByIdWithCountUsage } from "@/services/activities";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { canUpdateActivityStatus } from "@/lib/permission";
import { canUpdateCrop } from "@/lib/role";
import { ActivityDangerCard } from "./_components/activity-danger-card";

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
  const t = await getTranslations("activities.form");

  const data = await getActivityByIdWithCountUsage(params.activityId);
  if (!data) {
    notFound();
  }
  const canEdit =
    (await canUpdateCrop(data.cropId)) && canUpdateActivityStatus(data.status);
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
