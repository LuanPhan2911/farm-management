import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getEquipmentUsages } from "@/services/equipment-usages";
import { parseToNumber } from "@/lib/utils";
import { getCurrentStaff } from "@/services/staffs";
import { EquipmentUsagesTable } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/details/[equipmentDetailId]/usages/_components/equipment-usages-table";
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
  const currentStaff = await getCurrentStaff();

  const { data, totalPage } = await getEquipmentUsages({
    equipmentDetailId: params.equipmentDetailId,
    page,
    query,
    orderBy,
  });
  if (!currentStaff) {
    notFound();
  }
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
