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
import { ActivityCancelButton } from "../../../_components/activity-edit-status-button";
import { canUpdateActivityStatus, isSuperAdmin } from "@/lib/permission";

interface ActivityDangerPageProps {
  params: {
    activityId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("activities.page.detail.danger");
  return {
    title: t("title"),
  };
}

const ActivityDangerPage = async ({ params }: ActivityDangerPageProps) => {
  const t = await getTranslations("activities.form");
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  const data = await getActivityById({
    activityId: params.activityId,
    staffId: currentStaff.id,
  });
  if (!data) {
    notFound();
  }
  const canUpdate =
    canUpdateActivityStatus(data.status) && isSuperAdmin(currentStaff.role);
  return (
    <>
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
            redirectHref="activities"
          />
        </CardContent>
      </Card>
    </>
  );
};
export default ActivityDangerPage;
