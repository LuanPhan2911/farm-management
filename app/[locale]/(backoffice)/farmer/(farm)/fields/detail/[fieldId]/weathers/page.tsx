import { getWeathersOnField } from "@/services/weathers";

import { parseToDate, parseToNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

import { notFound } from "next/navigation";
import { WeathersTable } from "@/app/[locale]/(backoffice)/admin/(farm)/fields/detail/[fieldId]/weathers/_components/weathers-table";
import { WeathersBarChart } from "@/app/[locale]/(backoffice)/admin/(farm)/fields/detail/[fieldId]/weathers/_components/weathers-bar-chart";
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
  const field = await canGetField(params.fieldId);
  if (!field) {
    notFound();
  }

  const page = parseToNumber(searchParams!.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
  const begin = parseToDate(searchParams!.begin);
  const end = parseToDate(searchParams!.end);
  const t = await getTranslations("weathers.page");

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
