import { getWeathersOnField } from "@/services/weathers";
import { WeathersTable } from "./_components/weathers-table";
import { parseToDate, parseToNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { WeathersBarChart } from "./_components/weathers-bar-chart";
import { notFound } from "next/navigation";
import { canGetField } from "@/lib/role";

interface WeathersPageProps {
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
  const t = await getTranslations("weathers.page");
  return {
    title: t("title"),
  };
}
const WeathersPage = async ({ params, searchParams }: WeathersPageProps) => {
  const page = parseToNumber(searchParams!.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
  const begin = parseToDate(searchParams!.begin);
  const end = parseToDate(searchParams!.end);
  const t = await getTranslations("weathers.page");

  const field = await canGetField(params.fieldId);
  if (!field) {
    notFound();
  }
  const { data, totalPage } = await getWeathersOnField({
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
          <WeathersTable data={data} totalPage={totalPage} />
          <WeathersBarChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default WeathersPage;
