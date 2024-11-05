import { getActivityAssignedStaffs } from "@/services/activities";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityStaffsCreateButton } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/staffs/_components/activity-staffs-create-button";
import { ActivityStaffsTable } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/staffs/_components/activity-staffs-table";

export async function generateMetadata() {
  const t = await getTranslations("crops.page.detail.activities.detail.staffs");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <ActivityStaffsCreateButton data={data} />
        </div>
        <ActivityStaffsTable data={data} />
      </CardContent>
    </Card>
  );
};

export default ActivityStaffsPage;
