import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivityById, getActivitiesSelect } from "@/services/activities";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ActivityEditForm } from "../../../_components/activity-edit-button";
import { getCurrentStaff } from "@/services/staffs";

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
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityEditForm data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityDetailPage;
