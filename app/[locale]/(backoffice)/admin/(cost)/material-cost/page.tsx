import { getMaterialUsageCost } from "@/services/materials";

import { parseToDate } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaterialCostsTable } from "./_components/material-cost-table";
import {
  MaterialMostUsageChart,
  MaterialUsageCostChart,
} from "./_components/material-cost-chart";
interface MaterialCostsPageProps {
  searchParams: {
    query?: string;
    begin?: string;
    end?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("materials.page.cost");
  return {
    title: t("title"),
  };
}

const MaterialCostsPage = async ({ searchParams }: MaterialCostsPageProps) => {
  const t = await getTranslations("materials.page.cost");
  const { query } = searchParams;
  const begin = parseToDate(searchParams.begin);
  const end = parseToDate(searchParams.end);

  const data = await getMaterialUsageCost({
    begin,
    end,
    query,
  });
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <MaterialCostsTable data={data} />
          <div className="my-4 grid lg:grid-cols-2 gap-4">
            <MaterialUsageCostChart />
            <MaterialMostUsageChart />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialCostsPage;
