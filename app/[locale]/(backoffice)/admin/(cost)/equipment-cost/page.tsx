import { getMaterialUsageCost } from "@/services/materials";

import { parseToDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getEquipmentDetailUsageCost } from "@/services/equipment-details";
import { EquipmentDetailUsageCostTable } from "./_components/equipment-cost-table";
interface EquipmentDetailUsageCostsPageProps {
  searchParams: {
    begin?: string;
    end?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("equipmentDetails.page.cost");
  return {
    title: t("title"),
  };
}

const EquipmentDetailUsageCostsPage = async ({
  searchParams,
}: EquipmentDetailUsageCostsPageProps) => {
  const t = await getTranslations("materials.page.cost");

  const begin = parseToDate(searchParams.begin);
  const end = parseToDate(searchParams.end);

  const data = await getEquipmentDetailUsageCost({
    begin,
    end,
  });
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <EquipmentDetailUsageCostTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentDetailUsageCostsPage;
