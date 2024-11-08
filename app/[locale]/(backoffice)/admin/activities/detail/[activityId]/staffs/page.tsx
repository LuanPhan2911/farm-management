import { getActivityAssignedStaffs } from "@/services/activities";
import { getTranslations } from "next-intl/server";
import { ActivityStaffsTable } from "./_components/activity-staffs-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityStaffsCreateButton } from "./_components/activity-staffs-create-button";

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

  const { data, totalActualCost } = await getActivityAssignedStaffs(
    params.activityId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end my-4">
          <ActivityStaffsCreateButton data={data} />
        </div>
        <ActivityStaffsTable data={data} totalCost={totalActualCost} />
      </CardContent>
    </Card>
  );
};

export default ActivityStaffsPage;
