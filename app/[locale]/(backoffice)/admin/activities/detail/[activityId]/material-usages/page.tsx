import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getMaterialUsages } from "@/services/material-usages";
import { MaterialUsageCreateButton } from "../../../../(inventory)/materials/detail/[materialId]/usages/_components/material-usages-create-button";
import { MaterialUsagesTable } from "../../../../(inventory)/materials/detail/[materialId]/usages/_components/material-usages-table";
import { parseToNumber } from "@/lib/utils";
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
  const page = parseToNumber(searchParams!.page, 1);
  const { data, totalPage } = await getMaterialUsages({
    activityId: params.activityId,
    orderBy,
    query,
    page,
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
        <MaterialUsagesTable data={data} totalPage={totalPage} />
      </CardContent>
    </Card>
  );
};
export default ActivityMaterialUsagesPage;
