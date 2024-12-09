import { getActivityById } from "@/services/activities";
import { getTranslations } from "next-intl/server";
import { ActivityStaffsTable } from "./_components/activity-staffs-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityStaffsCreateButton } from "./_components/activity-staffs-create-button";
import { notFound } from "next/navigation";
import { getActivityAssignedStaffs } from "@/services/activity-assigned";
import { getCurrentStaffRole } from "@/services/staffs";
import { canUpdateActivityStatus, canUpdateCropStatus } from "@/lib/permission";

export async function generateMetadata() {
  const t = await getTranslations("activities.page.detail.staffs");
  return {
    title: t("title"),
  };
}

interface ActivityStaffsPageProps {
  params: {
    activityId: string;
  };
}

const ActivityStaffsPage = async ({ params }: ActivityStaffsPageProps) => {
  const t = await getTranslations("activities.page.detail.staffs");

  const data = await getActivityAssignedStaffs(params.activityId);
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
          <ActivityStaffsCreateButton data={data} canCreate={canManage} />
        </div>
        <ActivityStaffsTable
          data={data}
          canCreate={canManage}
          canDelete={canManage}
          canEdit={canManage}
        />
      </CardContent>
    </Card>
  );
};

export default ActivityStaffsPage;
