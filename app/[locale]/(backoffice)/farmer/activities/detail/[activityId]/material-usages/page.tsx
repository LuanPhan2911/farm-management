import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getMaterialUsagesByActivity } from "@/services/material-usages";
import { ActivityMaterialUsagesTable } from "@/app/[locale]/(backoffice)/admin/activities/detail/[activityId]/material-usages/_components/activity-material-usages-table";
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

  const data = await getMaterialUsagesByActivity({
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
        <ActivityMaterialUsagesTable data={data} />
      </CardContent>
    </Card>
  );
};
export default ActivityMaterialUsagesPage;
