import { getActivities } from "@/services/activities";
import { parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentStaff } from "@/services/staffs";
import { notFound } from "next/navigation";
import { ActivitiesTable } from "../../admin/activities/_components/activities-table";
interface ActivitiesPageProps {
  params: {};
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
    query?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("activities.page");
  return {
    title: t("title"),
  };
}

const ActivitiesPage = async ({ searchParams }: ActivitiesPageProps) => {
  const page = parseToNumber(searchParams!.page, 1);
  const t = await getTranslations("activities.page");
  const { orderBy, filterNumber, filterString, query } = searchParams;
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  const { data, totalPage } = await getActivities({
    filterNumber,
    filterString,
    orderBy,
    page,
    query,
    staffId: currentStaff.id,
  });
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivitiesTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesPage;
