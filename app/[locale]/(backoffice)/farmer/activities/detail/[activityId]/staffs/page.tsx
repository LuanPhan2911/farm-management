import {
  getActivityAssignedStaffs,
  getOnlyActivityById,
} from "@/services/activities";
import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityStaffsTable } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/staffs/_components/activity-staffs-table";
import { notFound } from "next/navigation";
import { canUpdateActivity } from "@/lib/role";

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
        <ActivityStaffsTable
          data={data}
          totalCost={totalCost}
          disabled={!canEdit}
        />
      </CardContent>
    </Card>
  );
};

export default ActivityStaffsPage;
