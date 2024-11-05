import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getActivityById } from "@/services/activities";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getCurrentStaff } from "@/services/staffs";
import { canUpdateActivityStatus } from "@/lib/permission";
import { ActivityEditForm } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-edit-button";

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
  const canUpdate = canUpdateActivityStatus(data.status);
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
