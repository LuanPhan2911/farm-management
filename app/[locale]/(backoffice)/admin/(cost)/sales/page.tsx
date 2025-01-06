import { parseToDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCropSaleCosts } from "@/services/crops";
import { CropsSaleTable } from "./_components/crops-sale-table";
import { auth } from "@clerk/nextjs/server";
import { getCurrentStaffRole } from "@/services/staffs";

interface SalesRevenuePageProps {
  searchParams: {
    begin?: string;
    end?: string;
    query?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("sales.page.cost");
  return {
    title: t("title"),
  };
}

const EquipmentDetailUsageCostsPage = async ({
  searchParams,
}: SalesRevenuePageProps) => {
  const t = await getTranslations("sales.page.cost");
  const { orgId } = auth();
  const begin = parseToDate(searchParams.begin);
  const end = parseToDate(searchParams.end);
  const { query } = searchParams;

  const { isSuperAdmin } = await getCurrentStaffRole();
  const data = await getCropSaleCosts({
    begin,
    end,
    query,
    orgId,
    getAll: isSuperAdmin,
  });
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <CropsSaleTable data={data} totalPage={0} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentDetailUsageCostsPage;
