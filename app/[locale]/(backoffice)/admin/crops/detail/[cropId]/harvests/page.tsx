import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { getOnlyCropById } from "@/services/crops";
import { HarvestCreateButton } from "./_components/harvest-create-button";
import { getCurrentStaff, getCurrentStaffRole } from "@/services/staffs";
import { notFound } from "next/navigation";
import { HarvestsTable } from "./_components/harvests-table";
import { getHarvests } from "@/services/harvests";
import { parseToDate, parseToNumber } from "@/lib/utils";
import { canCreateHarvestAndSaleCropStatus } from "@/lib/permission";

interface HarvestsPageProps {
  params: {
    cropId: string;
  };
  searchParams: {
    begin?: string;
    end?: string;
    page?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("harvests.page");
  return {
    title: t("title"),
  };
}

const HarvestsPage = async ({ params, searchParams }: HarvestsPageProps) => {
  const t = await getTranslations("harvests.page");
  const crop = await getOnlyCropById(params.cropId);
  const currentStaff = await getCurrentStaff();
  if (!crop || !currentStaff) {
    notFound();
  }
  const begin = parseToDate(searchParams.begin);
  const end = parseToDate(searchParams.end);
  const page = parseToNumber(searchParams.page, 1);
  const { data, totalPage } = await getHarvests({
    cropId: params.cropId,
    begin,
    end,
    page,
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
            <HarvestCreateButton
              crop={crop}
              currentStaff={currentStaff}
              canCreate={canCreate}
            />
          </div>
          <HarvestsTable
            data={data}
            totalPage={totalPage}
            canDelete={canDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default HarvestsPage;
