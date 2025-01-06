import { getCrops } from "@/services/crops";
import { CropsTable } from "./_components/crops-table";
import { parseToDate, parseToNumber } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CropCreateButton } from "./_components/crop-create-button";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { checkRole } from "@/lib/role";
import { getCurrentStaffRole } from "@/services/staffs";
interface CropsPageProps {
  searchParams: {
    plantId?: string;
    fieldId?: string;
    page?: string;
    begin?: string;
    end?: string;
    query?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("crops.page");
  return {
    title: t("title"),
  };
}
const CropsPage = async ({ searchParams }: CropsPageProps) => {
  const { orgId } = auth();
  const { query, plantId, fieldId } = searchParams;
  const startDate = parseToDate(searchParams!.begin);
  const endDate = parseToDate(searchParams!.end);
  const page = parseToNumber(searchParams!.page, 1);
  const t = await getTranslations("crops.page");

  const { isSuperAdmin } = await getCurrentStaffRole();
  const canCreate = isSuperAdmin;

  const { data, totalPage } = await getCrops({
    orgId,
    page,
    startDate,
    endDate,
    query,
    plantId,
    fieldId,

    getAll: isSuperAdmin,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <CropCreateButton canCreate={canCreate} />
          </div>
          <CropsTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CropsPage;
