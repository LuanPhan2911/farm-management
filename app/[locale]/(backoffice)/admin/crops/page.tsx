import { getCrops } from "@/services/crops";
import { CropsTable } from "./_components/crops-table";
import { parseToDate, parseToNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CropCreateButton } from "./_components/crop-create-button";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
interface CropsPageProps {
  searchParams: {
    plantId?: string;
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
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
  const { query: name, orderBy, plantId, filterNumber } = searchParams;
  const startDate = parseToDate(searchParams!.begin);
  const endDate = parseToDate(searchParams!.end);
  const page = parseToNumber(searchParams!.page, 1);
  const t = await getTranslations("crops.page");
  const { data, totalPage } = await getCrops({
    orgId,
    page,
    orderBy,
    filterNumber,
    startDate,
    endDate,
    name,
    plantId,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <CropCreateButton />
          </div>
          <CropsTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CropsPage;
