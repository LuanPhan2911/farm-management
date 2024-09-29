import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSchedules } from "@/services/schedules";
import { getTranslations } from "next-intl/server";
import { SchedulesDataTable } from "./_components/schedules-data-table";
import { ScheduleCreateButton } from "./_components/schedule-create-button";
import { SchedulesDefault } from "./_components/schedules-default";
import { ScheduleRefreshButton } from "./_components/schedule-refresh-button";

export async function generateMetadata() {
  const t = await getTranslations("schedules.page");
  return {
    title: t("title"),
  };
}
const SchedulesPage = async () => {
  const data = await getSchedules();
  const t = await getTranslations("schedules.page");
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>
            {t("title")} <ScheduleRefreshButton />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SchedulesDefault />
          <div className="flex justify-end">
            <ScheduleCreateButton />
          </div>
          <SchedulesDataTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulesPage;
