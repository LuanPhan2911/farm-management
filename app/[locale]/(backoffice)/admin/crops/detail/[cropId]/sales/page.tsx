import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { getOnlyCropById } from "@/services/crops";
import { getCurrentStaff, getCurrentStaffRole } from "@/services/staffs";
import { notFound } from "next/navigation";
import { parseToDate, parseToNumber } from "@/lib/utils";
import { getSales } from "@/services/sales";
import { SaleCreateButton } from "./_components/sale-create-button";
import { SalesTable } from "./_components/sales-table";
import { canCreateHarvestAndSaleCropStatus } from "@/lib/permission";

interface SalesPageProps {
  params: {
    cropId: string;
  };
  searchParams: {
    begin?: string;
    end?: string;
    page?: string;
    query?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("sales.page");
  return {
    title: t("title"),
  };
}

const SalesPage = async ({ params, searchParams }: SalesPageProps) => {
  const t = await getTranslations("sales.page");
  const crop = await getOnlyCropById(params.cropId);
  const currentStaff = await getCurrentStaff();
  if (!crop || !currentStaff) {
    notFound();
  }
  const begin = parseToDate(searchParams.begin);
  const end = parseToDate(searchParams.end);
  const page = parseToNumber(searchParams.page, 1);
  const { query } = searchParams;
  const { data, totalPage } = await getSales({
    cropId: params.cropId,
    begin,
    end,
    page,
    query,
  });

  const { isOnlyAdmin } = await getCurrentStaffRole();

  const canCreate =
    canCreateHarvestAndSaleCropStatus(crop.status) && isOnlyAdmin;
  const canDelete =
    canCreateHarvestAndSaleCropStatus(crop.status) && isOnlyAdmin;
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <SaleCreateButton
              crop={crop}
              currentStaff={currentStaff}
              canCreate={canCreate}
            />
          </div>
          <SalesTable data={data} totalPage={totalPage} canDelete={canDelete} />
        </CardContent>
      </Card>
    </div>
  );
};
export default SalesPage;
