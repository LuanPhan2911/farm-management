import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getMaterialUsagesByActivity } from "@/services/material-usages";
import { MaterialUsageCreateButton } from "../../../../(inventory)/materials/detail/[materialId]/usages/_components/material-usages-create-button";
import { MaterialUsagesTable } from "../../../../(inventory)/materials/detail/[materialId]/usages/_components/material-usages-table";
export async function generateMetadata() {
  const t = await getTranslations("activities.page.detail.material-usages");
  return {
    title: t("title"),
  };
}

interface MaterialUsagesPageProps {
  params: {
    activityId: string;
  };
  searchParams: {
    query?: string;
    orderBy?: string;
    page?: string;
  };
}
const ActivityMaterialUsagesPage = async ({
  params,
  searchParams,
}: MaterialUsagesPageProps) => {
  const t = await getTranslations("activities.page.detail.material-usages");
  const { query, orderBy } = searchParams;

  const { data, totalCost } = await getMaterialUsagesByActivity({
    activityId: params.activityId,
    orderBy,
    query,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <MaterialUsageCreateButton />
        </div>
        <MaterialUsagesTable data={data} totalPage={0} totalCost={totalCost} />
      </CardContent>
    </Card>
  );
};
export default ActivityMaterialUsagesPage;
