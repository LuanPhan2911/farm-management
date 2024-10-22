import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { getMaterialUsagesByActivityId } from "@/services/material-usages";
import { ActivityMaterialUsageCreateButton } from "./_components/activity-material-usage-create-button";
import { ActivityMaterialUsagesTable } from "./_components/activity-material-usages-table";
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
  };
}
const ActivityMaterialUsagesPage = async ({
  params,
  searchParams,
}: MaterialUsagesPageProps) => {
  const t = await getTranslations("activities.page.detail.material-usages");
  const { query, orderBy } = searchParams;

  const data = await getMaterialUsagesByActivityId({
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
          <ActivityMaterialUsageCreateButton />
        </div>
        <ActivityMaterialUsagesTable data={data} />
      </CardContent>
    </Card>
  );
};
export default ActivityMaterialUsagesPage;
