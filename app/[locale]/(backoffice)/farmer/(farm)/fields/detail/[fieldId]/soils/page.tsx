import { getSoilsOnField } from "@/services/soils";

import { parseToDate, parseToNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { SoilsTable } from "@/app/[locale]/(backoffice)/admin/(farm)/fields/detail/[fieldId]/soils/_components/soils-table";
import { SoilsBarChart } from "@/app/[locale]/(backoffice)/admin/(farm)/fields/detail/[fieldId]/soils/_components/soils-bar-chart";
import { notFound } from "next/navigation";
import { canGetField } from "@/lib/role";

interface SoilsPageProps {
  params: {
    fieldId: string;
  };
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
    begin?: string;
    end?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("soils.page");
  return {
    title: t("title"),
  };
}
const SoilsPage = async ({ params, searchParams }: SoilsPageProps) => {
  const field = await canGetField(params.fieldId);
  if (!field) {
    notFound();
  }
  const page = parseToNumber(searchParams!.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
  const begin = parseToDate(searchParams!.begin);
  const end = parseToDate(searchParams!.end);
  const t = await getTranslations("soils.page");
  const { data, totalPage } = await getSoilsOnField({
    fieldId: params!.fieldId,
    page,
    orderBy,
    filterString,
    filterNumber,
    begin,
    end,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <SoilsTable data={data} totalPage={totalPage} />
          <SoilsBarChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default SoilsPage;
