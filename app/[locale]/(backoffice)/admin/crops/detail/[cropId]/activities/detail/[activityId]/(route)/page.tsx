import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActivityById } from "@/services/activities";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { ActivityEditForm } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-edit-button";
import { canUpdateActivityStatus, canUpdateCropStatus } from "@/lib/permission";
import { getCurrentStaffRole } from "@/services/staffs";

export async function generateMetadata() {
  const t = await getTranslations("crops.page.detail.activities.detail");
  return {
    title: t("title"),
  };
}

interface CropActivityDetailPageProps {
  params: {
    activityId: string;
    cropId: string;
  };
}
const CropActivityDetailPage = async ({
  params,
}: CropActivityDetailPageProps) => {
  const t = await getTranslations("crops.page.detail.activities.detail");

  const data = await getActivityById(params.activityId);
  if (!data) {
    notFound();
  }
  const { isOnlyAdmin } = await getCurrentStaffRole();

  const canEdit =
    isOnlyAdmin &&
    canUpdateCropStatus(data.crop.status) &&
    canUpdateActivityStatus(data.status);

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityEditForm data={data} canEdit={canEdit} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CropActivityDetailPage;
