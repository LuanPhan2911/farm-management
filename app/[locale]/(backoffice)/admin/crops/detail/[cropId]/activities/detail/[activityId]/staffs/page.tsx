import { getActivityAssignedStaffs } from "@/services/activity-assigned";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityStaffsCreateButton } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/staffs/_components/activity-staffs-create-button";
import { ActivityStaffsTable } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/staffs/_components/activity-staffs-table";
import { canUpdateActivity } from "@/lib/role";

export async function generateMetadata() {
  const t = await getTranslations("crops.page.detail.activities.detail.staffs");
  return {
    title: t("title"),
  };
}

interface ActivityStaffsPageProps {
  params: {
    activityId: string;
    cropId: string;
  };
}

const ActivityStaffsPage = async ({ params }: ActivityStaffsPageProps) => {
  const t = await getTranslations("activities.page.detail.staffs");

  const data = await getActivityAssignedStaffs(params.activityId);
  const canEdit = await canUpdateActivity(params.cropId, params.activityId);
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
