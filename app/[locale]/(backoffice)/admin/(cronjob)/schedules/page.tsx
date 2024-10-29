import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSchedules } from "@/services/schedules";
import { getTranslations } from "next-intl/server";
import { SchedulesDataTable } from "./_components/schedules-data-table";
import { ScheduleCreateButton } from "./_components/schedule-create-button";
import { LiveRefreshButton } from "@/components/buttons/live-refresh-button";
import { refresh } from "@/actions/schedule";
import { ScheduleSendMailButton } from "./_components/schedule-send-mail-button";

export async function generateMetadata() {
  const t = await getTranslations("schedules.page");
  return {
    title: t("title"),
  };
}
const SchedulesPage = async () => {
  const data = await getSchedules();
  const t = await getTranslations("schedules.page");
  const appKey = process.env.APP_API_KEY;
  const appUrl = process.env.APP_BASE_URL;
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>
            {t("title")} <LiveRefreshButton refreshFn={refresh} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleSendMailButton appKey={appKey} appUrl={appUrl} />
          <div className="flex justify-end">
            <ScheduleCreateButton appKey={appKey} appUrl={appUrl} />
          </div>
          <SchedulesDataTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default SchedulesPage;
