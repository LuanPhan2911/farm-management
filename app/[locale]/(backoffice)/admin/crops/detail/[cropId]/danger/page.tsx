import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { DestroyButton } from "@/components/buttons/destroy-button";

import { getCurrentStaff } from "@/services/staffs";

import { canUpdateCropStatus, isSuperAdmin } from "@/lib/permission";
import { getCropByIdWithCount } from "@/services/crops";
import { destroy } from "@/actions/crop";
import { CropFinishButton } from "../../../_components/crop-edit-status-button";

interface ActivityDangerPageProps {
  params: {
    cropId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("crops.page.detail.danger");
  return {
    title: t("title"),
  };
}

const ActivityDangerPage = async ({ params }: ActivityDangerPageProps) => {
  const t = await getTranslations("crops.form");
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  const data = await getCropByIdWithCount(params.cropId);
  if (!data) {
    notFound();
  }

  const canEdit =
    canUpdateCropStatus(data.status) && isSuperAdmin(currentStaff.role);
  const canDelete = canEdit && data._count.activities === 0;
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t("finish.title")}</CardTitle>
          <CardDescription>{t("finish.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <CropFinishButton id={data.id} disabled={!canEdit} />
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
            inltKey="crops"
            redirectHref="crops"
            disabled={!canDelete}
          />
        </CardContent>
      </Card>
    </>
  );
};
export default ActivityDangerPage;
