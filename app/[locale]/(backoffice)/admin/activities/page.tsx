import { getActivities } from "@/services/activities";
import { ActivitiesTable } from "./_components/activities-table";
import { parseToDate, parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityCreateButton } from "./_components/activity-create-button";
import { getCurrentStaffRole } from "@/services/staffs";
interface ActivitiesPageProps {
  params: {};
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
    query?: string;
    type?: string;
    begin?: string;
    end?: string;
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
  const { orderBy, filterNumber, filterString, query, type } = searchParams;
  const begin = parseToDate(searchParams!.begin);
  const end = parseToDate(searchParams!.end);
  const { data, totalPage } = await getActivities({
    filterNumber,
    filterString,
    orderBy,
    page,
    query,
    type: type === "createdBy" ? "createdBy" : undefined,
    begin,
    end,
  });

  const { isOnlyAdmin } = await getCurrentStaffRole();
  const canCreate = isOnlyAdmin;
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <ActivityCreateButton canCreate={canCreate} />
          </div>
          <ActivitiesTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivitiesPage;
