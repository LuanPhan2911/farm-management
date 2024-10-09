import { getPesticides } from "@/services/pesticides";
import { PesticidesTable } from "./_components/pesticides-table";
import { parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PesticideCreateButton } from "./_components/pesticide-create-button";

interface PesticidePageProps {
  params: {};
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
  };
}

export async function generateMetadata() {
  const t = await getTranslations("pesticides.page");
  return {
    title: t("title"),
  };
}
const PesticidesPage = async ({ searchParams }: PesticidePageProps) => {
  const page = parseToNumber(searchParams!.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
  const t = await getTranslations("pesticides.page");
  const { data, totalPage } = await getPesticides({
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
            <PesticideCreateButton />
          </div>
          <PesticidesTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PesticidesPage;
