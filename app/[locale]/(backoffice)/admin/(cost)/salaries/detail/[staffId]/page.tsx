import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseToDate } from "@/lib/utils";
import { getStaffSalaryByStaffId } from "@/services/activity-assigned";

import { getTranslations } from "next-intl/server";
import { StaffSalariesDetailTable } from "./_components/staff-salary-detail-table";
import {
  StaffHourlyWorkChart,
  StaffSalaryDetailChart,
} from "./_components/staff-salary-detail-chart";

interface SalaryDetailPageProps {
  params: {
    staffId: string;
  };
  searchParams: {
    query?: string;
    begin?: string;
    end?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("salaries.page.detail");
  return {
    title: t("title"),
  };
}

const StaffSalaryDetailPage = async ({
  searchParams,
  params,
}: SalaryDetailPageProps) => {
  const t = await getTranslations("salaries.page.detail");
  const { query } = searchParams;
  const begin = parseToDate(searchParams.begin);
  const end = parseToDate(searchParams.end);

  const data = await getStaffSalaryByStaffId({
    begin,
    end,
    query,
    staffId: params.staffId,
  });
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <StaffSalariesDetailTable data={data} />
          <div className="my-4">
            <div className="grid grid-cols-2 gap-4">
              <StaffSalaryDetailChart staffId={params.staffId} />
              <StaffHourlyWorkChart staffId={params.staffId} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffSalaryDetailPage;
