import { getFertilizers } from "@/services/fertilizers";
import { FertilizersTable } from "./_components/fertilizers-table";
import { parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FertilizerCreateButton } from "./_components/fertilizer-create-button";

interface FertilizerPageProps {
  params: {};
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("fertilizers.page");
  return {
    title: t("title"),
  };
}

const FertilizersPage = async ({ searchParams }: FertilizerPageProps) => {
  const page = parseToNumber(searchParams!.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
  const t = await getTranslations("fertilizers.page");
  const { data, totalPage } = await getFertilizers({
    filterNumber,
    filterString,
    orderBy,
    page,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <FertilizerCreateButton />
          </div>
          <FertilizersTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FertilizersPage;
