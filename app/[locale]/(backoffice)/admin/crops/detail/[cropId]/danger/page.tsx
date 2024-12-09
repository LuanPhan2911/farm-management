import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getCurrentStaffRole } from "@/services/staffs";

import { canUpdateCropStatus } from "@/lib/permission";
import { getCropByIdWithCount } from "@/services/crops";
import { CropDangerCard } from "./_components/crop-danger-card";

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
  const data = await getCropByIdWithCount(params.cropId);
  if (!data) {
    notFound();
  }
  const { isSuperAdmin } = await getCurrentStaffRole();

  const canEdit = canUpdateCropStatus(data.status) && isSuperAdmin;
  const canDelete = canEdit && data._count.activities === 0;
  return (
    <CropDangerCard
      id={data.id}
      canDelete={canDelete}
      canEdit={canEdit}
      redirectUrl="crops"
    />
  );
};
export default ActivityDangerPage;
