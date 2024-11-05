import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getActivityById } from "@/services/activities";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/activity";
import { getCurrentStaff } from "@/services/staffs";
import { canUpdateActivityStatus, isSuperAdmin } from "@/lib/permission";
import {
  ActivityCancelButton,
  ActivityCompletedButton,
} from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-edit-status-button";

interface ActivityDangerPageProps {
  params: {
    cropId: string;
    activityId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("crops.page.detail.activities.detail.danger");
  return {
    title: t("title"),
  };
}

const ActivityDangerPage = async ({ params }: ActivityDangerPageProps) => {
  const t = await getTranslations("activities.form");
  const currentStaff = await getCurrentStaff();

  const data = await getActivityById(params.activityId);
  if (!data || !currentStaff) {
    notFound();
  }
  const canUpdate =
    canUpdateActivityStatus(data.status) && isSuperAdmin(currentStaff.role);
  const canDelete = isSuperAdmin(currentStaff.role);
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("complete.title")}</CardTitle>
          <CardDescription>{t("complete.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityCompletedButton activityId={data.id} disabled={!canUpdate} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("cancel.title")}</CardTitle>
          <CardDescription>{t("cancel.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityCancelButton activityId={data.id} disabled={!canUpdate} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("destroy.title")}</CardTitle>
          <CardDescription>{t("destroy.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="activities"
            redirectHref={`crops/detail/${params.cropId}/activities`}
            disabled={!canDelete}
          />
        </CardContent>
      </Card>
    </>
  );
};
export default ActivityDangerPage;
