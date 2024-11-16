import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseToDate } from "@/lib/utils";
import { getStaffSalaries } from "@/services/activity-assigned";

import { getTranslations } from "next-intl/server";
import { StaffSalariesTable } from "./_components/staff-salaries-table";
import {
  StaffHourlyWorksChart,
  StaffSalariesChart,
} from "./_components/staff-salaries-chart";
import { auth } from "@clerk/nextjs/server";

interface SalariesPageProps {
  searchParams: {
    query?: string;
    begin?: string;
    end?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("salaries.page");
  return {
    title: t("title"),
  };
}

const StaffSalariesPage = async ({ searchParams }: SalariesPageProps) => {
  const t = await getTranslations("salaries.page");
  const { query } = searchParams;
  const begin = parseToDate(searchParams.begin);
  const end = parseToDate(searchParams.end);
  const { orgId } = auth();
  const data = await getStaffSalaries({
    begin,
    end,
    query,
    orgId,
  });
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffSalariesTable data={data} />
          <div className="my-4">
            <div className="grid grid-cols-2 gap-4">
              <StaffSalariesChart />
              <StaffHourlyWorksChart />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffSalariesPage;
