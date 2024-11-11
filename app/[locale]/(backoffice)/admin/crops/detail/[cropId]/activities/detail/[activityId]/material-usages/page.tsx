import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getMaterialUsagesByActivity } from "@/services/material-usages";
import { MaterialUsageCreateButton } from "@/app/[locale]/(backoffice)/admin/(inventory)/materials/detail/[materialId]/usages/_components/material-usages-create-button";
import { getOnlyActivityById } from "@/services/activities";
import { notFound } from "next/navigation";
import { canUpdateActivityStatus } from "@/lib/permission";
import { ActivityMaterialUsagesTable } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/material-usages/_components/activity-material-usages-table";
import { canUpdateActivity } from "@/lib/role";
export async function generateMetadata() {
  const t = await getTranslations("activities.page.detail.material-usages");
  return {
    title: t("title"),
  };
}

interface CropMaterialUsagesPageProps {
  params: {
    activityId: string;
    cropId: string;
  };
  searchParams: {
    query?: string;
    orderBy?: string;
  };
}
const CropActivityMaterialUsagesPage = async ({
  params,
  searchParams,
}: CropMaterialUsagesPageProps) => {
  const t = await getTranslations("activities.page.detail.material-usages");
  const { query, orderBy } = searchParams;

  const { data, totalCost } = await getMaterialUsagesByActivity({
    activityId: params.activityId,
    orderBy,
    query,
  });

  const canEdit = await canUpdateActivity(params.cropId, params.activityId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <MaterialUsageCreateButton disabled={!canEdit} />
        </div>
        <ActivityMaterialUsagesTable
          data={data}
          totalCost={totalCost}
          disabled={!canEdit}
        />
      </CardContent>
    </Card>
  );
};
export default CropActivityMaterialUsagesPage;
