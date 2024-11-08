import { getStaffs } from "@/services/staffs";
import { StaffsTable } from "./_components/staffs-table";
import { parseToNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaffCreateButton } from "./_components/staff-create-button";
import { getTranslations } from "next-intl/server";

interface StaffsPageProps {
  searchParams: {
    query?: string;
    page?: string;
    orderBy?: string;
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
  const { data, totalPage } = await getStaffs({
    query,
    page,
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
          <StaffsTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffsPage;
