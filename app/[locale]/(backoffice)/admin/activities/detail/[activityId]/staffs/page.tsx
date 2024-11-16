import { getOnlyActivityById } from "@/services/activities";
import { getTranslations } from "next-intl/server";
import { ActivityStaffsTable } from "./_components/activity-staffs-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityStaffsCreateButton } from "./_components/activity-staffs-create-button";
import { notFound } from "next/navigation";
import { canUpdateActivity } from "@/lib/role";
import { getActivityAssignedStaffs } from "@/services/activity-assigned";

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
  const activity = await getOnlyActivityById(params.activityId);
  if (!activity) {
    notFound();
  }
  const canEdit = await canUpdateActivity(activity.cropId, params.activityId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <ActivityStaffsCreateButton data={data} disabled={!canEdit} />
        </div>
        <ActivityStaffsTable data={data} disabled={!canEdit} />
      </CardContent>
    </Card>
  );
};

export default ActivityStaffsPage;
