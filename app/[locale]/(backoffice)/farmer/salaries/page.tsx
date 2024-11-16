import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseToDate } from "@/lib/utils";
import { getStaffSalaryByStaffId } from "@/services/activity-assigned";
import { getCurrentStaff } from "@/services/staffs";

import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { StaffSalariesDetailTable } from "../../admin/(cost)/salaries/detail/[staffId]/_components/staff-salary-detail-table";
import {
  StaffHourlyWorkChart,
  StaffSalaryDetailChart,
} from "../../admin/(cost)/salaries/detail/[staffId]/_components/staff-salary-detail-chart";

interface SalaryActivityPageProps {
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

const StaffSalaryActivityPage = async ({
  searchParams,
}: SalaryActivityPageProps) => {
  const t = await getTranslations("salaries.page.detail");
  const { query } = searchParams;
  const begin = parseToDate(searchParams.begin);
  const end = parseToDate(searchParams.end);
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  const data = await getStaffSalaryByStaffId({
    begin,
    end,
    query,
    staffId: currentStaff.id,
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
              <StaffSalaryDetailChart staffId={currentStaff.id} />
              <StaffHourlyWorkChart staffId={currentStaff.id} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffSalaryActivityPage;
