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
  return (
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
          redirectHref="/admin/activities"
        />
      </CardContent>
    </Card>
  );
};
export default ActivityDangerPage;
