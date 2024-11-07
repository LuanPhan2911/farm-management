import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";

import { getEquipmentUsages } from "@/services/equipment-usages";
import { EquipmentUsagesTable } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/details/[equipmentDetailId]/usages/_components/equipment-usages-table";
import { parseToNumber } from "@/lib/utils";
export async function generateMetadata() {
  const t = await getTranslations("activities.page.detail.equipment-usages");
  return {
    title: t("title"),
  };
}

interface ActivityEquipmentUsagesPageProps {
  params: {
    activityId: string;
  };
  searchParams: {
    query?: string;
    orderBy?: string;
    page?: string;
  };
}
const ActivityEquipmentUsagesPage = async ({
  params,
  searchParams,
}: ActivityEquipmentUsagesPageProps) => {
  const t = await getTranslations("activities.page.detail.equipment-usages");
  const { query, orderBy } = searchParams;
  const page = parseToNumber(searchParams!.page, 1);
  const { data, totalPage } = await getEquipmentUsages({
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
        <EquipmentUsagesTable data={data} totalPage={totalPage} />
      </CardContent>
    </Card>
  );
};
export default ActivityEquipmentUsagesPage;
