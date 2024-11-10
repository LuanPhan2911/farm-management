import {
  getActivityAssignedStaffs,
  getActivityById,
} from "@/services/activities";
import { getTranslations } from "next-intl/server";
import { ActivityStaffsTable } from "./_components/activity-staffs-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityStaffsCreateButton } from "./_components/activity-staffs-create-button";
import { notFound } from "next/navigation";
import { canUpdateActivityStatus } from "@/lib/permission";

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

  const { data, totalCost } = await getActivityAssignedStaffs(
    params.activityId
  );
  const activity = await getActivityById(params.activityId);
  if (!activity) {
    notFound();
  }
  const canUpdateActivity = canUpdateActivityStatus(activity.status);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end my-4">
          <ActivityStaffsCreateButton
            data={data}
            disabled={!canUpdateActivity}
          />
        </div>
        <ActivityStaffsTable data={data} totalCost={totalCost} />
      </CardContent>
    </Card>
  );
};

export default ActivityStaffsPage;
