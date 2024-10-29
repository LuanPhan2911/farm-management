import { getTasks } from "@/services/tasks";
import { TasksDataTable } from "./_components/tasks-data-table";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCreateButton } from "./_components/task-create-button";
import { TaskDeleteUnusedUnitButton } from "./_components/task-delete-unused-unit-button";
import { TaskSendMailButton } from "./_components/task-send-mail-button";
import { LiveRefreshButton } from "@/components/buttons/live-refresh-button";
import { refresh } from "@/actions/task";

export async function generateMetadata() {
  const t = await getTranslations("tasks.page");
  return {
    title: t("title"),
  };
}
const TasksPage = async () => {
  const tasks = await getTasks();
  const t = await getTranslations("tasks.page");
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
          <div className="flex gap-x-2">
            <TaskDeleteUnusedUnitButton appKey={appKey} appUrl={appUrl} />
            <TaskSendMailButton appKey={appKey} appUrl={appUrl} />
          </div>

          <div className="flex justify-end gap-x-2">
            <TaskCreateButton appKey={appKey} appUrl={appUrl} />
          </div>
          <TasksDataTable data={tasks} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksPage;
