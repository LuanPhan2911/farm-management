import { getStaffsTable } from "@/services/staffs";

import { UserOrderBy } from "@/services/users";
import { parseToNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { StaffsTable } from "../../admin/(account)/staffs/_components/staffs-table";

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
  const page = parseToNumber(searchParams!.page, 1);
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
          <StaffsTable data={structuredClone(staffs)} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffsPage;
