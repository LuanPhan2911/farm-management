import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActivityById } from "@/services/activities";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { ActivityEditForm } from "../../../_components/activity-edit-button";
import { getCurrentStaffRole } from "@/services/staffs";
import { canUpdateActivityStatus, canUpdateCropStatus } from "@/lib/permission";

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
  const data = await getActivityById(params.activityId);
  const t = await getTranslations("activities.page.detail");
  if (!data) {
    notFound();
  }

  const { isOnlyAdmin } = await getCurrentStaffRole();

  const canEdit =
    isOnlyAdmin &&
    canUpdateCropStatus(data.crop.status) &&
    canUpdateActivityStatus(data.status);

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityEditForm data={data} canEdit={canEdit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityDetailPage;
