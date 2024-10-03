import { getEquipments } from "@/services/equipments";
import { EquipmentsTable } from "./_components/equipments-table";
import { parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentCreateButton } from "./_components/equipment-create-button";
interface EquipmentsPageProps {
  params: {};
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("equipments.page");
  return {
    title: t("title"),
  };
}

const EquipmentsPage = async ({
  params,
  searchParams,
}: EquipmentsPageProps) => {
  const page = parseToNumber(searchParams!.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
  const t = await getTranslations("equipments.page");
  const { data, totalPage } = await getEquipments({
    filterNumber,
    filterString,
    orderBy,
    page,
  });
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <EquipmentCreateButton />
          </div>
          <EquipmentsTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentsPage;
