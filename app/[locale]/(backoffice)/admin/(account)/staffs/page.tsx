import { getStaffsTable } from "@/services/staffs";
import { StaffsTable } from "./_components/staffs-table";
import { UserOrderBy } from "@/services/users";
import { parseToNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffCreateButton } from "./_components/staff-create-button";
import { getTranslations } from "next-intl/server";

interface StaffsPageProps {
  searchParams: {
    query?: string;
    page?: string;
    orderBy?: UserOrderBy;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("staffs.page");
  return {
    title: t("title"),
  };
}

const StaffsPage = async ({ searchParams }: StaffsPageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const t = await getTranslations("staffs.page");
  const { orderBy, query } = searchParams;
  const { data: staffs, totalPage } = await getStaffsTable({
    query,
    currentPage: page,
    orderBy,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <StaffCreateButton />
          </div>
          <StaffsTable data={structuredClone(staffs)} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffsPage;
