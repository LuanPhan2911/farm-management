import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivityById } from "@/services/activities";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ActivityEditForm } from "../../../_components/activity-edit-button";
import { getCurrentStaff } from "@/services/staffs";
import { ActivityCompletedButton } from "../../../_components/activity-edit-status-button";
import { canUpdateActivityStatus } from "@/lib/permission";

export async function generateMetadata() {
  const t = await getTranslations("activities.page.detail");
  return {
    title: t("title"),
  };
}

interface ActivityDetailPageProps {
  params: {
    activityId: string;
  };
}
const ActivityDetailPage = async ({ params }: ActivityDetailPageProps) => {
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  const data = await getActivityById({
    activityId: params.activityId,
    staffId: currentStaff.id,
  });
  const t = await getTranslations("activities.page.detail");
  if (!data) {
    notFound();
  }
  const canUpdate = canUpdateActivityStatus(data.status);
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <ActivityCompletedButton
              activityId={data.id}
              disabled={!canUpdate}
            />
          </div>
          <ActivityEditForm data={data} disabled={!canUpdate} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityDetailPage;
