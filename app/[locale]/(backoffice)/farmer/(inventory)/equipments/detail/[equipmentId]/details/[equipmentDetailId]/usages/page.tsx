import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { parseToNumber } from "@/lib/utils";
import { EquipmentUsagesTable } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/details/[equipmentDetailId]/usages/_components/equipment-usages-table";
import { getEquipmentUsages } from "@/services/equipment-usages";

export async function generateMetadata() {
  const t = await getTranslations("equipmentUsages.page");
  return {
    title: t("title"),
  };
}

interface EquipmentUsagesPageProps {
  params: {
    equipmentId: string;
    equipmentDetailId: string;
  };
  searchParams: {
    page?: string;
    query?: string;
    orderBy?: string;
  };
}
const EquipmentUsagesPage = async ({
  params,
  searchParams,
}: EquipmentUsagesPageProps) => {
  const t = await getTranslations("equipmentUsages.page");
  const { query, orderBy } = searchParams;
  const page = parseToNumber(searchParams!.page, 1);

  const { data, totalPage } = await getEquipmentUsages({
    equipmentDetailId: params.equipmentDetailId,
    page,
    query,
    orderBy,
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
export default EquipmentUsagesPage;
