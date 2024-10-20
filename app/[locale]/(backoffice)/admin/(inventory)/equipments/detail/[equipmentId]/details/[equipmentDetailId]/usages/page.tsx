import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { EquipmentUsageCreateButton } from "./_components/equipment-usage-create-button";
import { EquipmentUsagesTable } from "./_components/equipment-usages-table";
import { getEquipmentUsages } from "@/services/equipment-usages";
import { parseToNumber } from "@/lib/utils";
import { getEquipmentDetailsSelect } from "@/services/equipment-details";
import { getCurrentStaff } from "@/services/staffs";
export async function generateMetadata() {
  const t = await getTranslations("equipmentUsages.page");
  return {
    title: t("title"),
  };
}

export async function generateStaticParams({
  params,
}: EquipmentUsagesPageProps) {
  const equipmentDetails = await getEquipmentDetailsSelect(params.equipmentId);
  return equipmentDetails.map(({ id, equipmentId }) => {
    return {
      equipmentDetailId: id,
      equipmentId: equipmentId,
    };
  });
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
        <div className="flex justify-end">
          <EquipmentUsageCreateButton currentOperator={currentStaff} />
        </div>
        <EquipmentUsagesTable data={data} totalPage={totalPage} />
      </CardContent>
    </Card>
  );
};
export default EquipmentUsagesPage;
