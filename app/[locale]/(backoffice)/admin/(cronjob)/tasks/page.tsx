import { getTasks } from "@/services/tasks";
import { TasksDataTable } from "./_components/tasks-data-table";
import { TasksDefault } from "./_components/tasks-default";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskRefreshButton } from "./_components/task-refresh-button";
import { TaskCreateButton } from "./_components/task-create-button";

export async function generateMetadata() {
  const t = await getTranslations("tasks.page");
  return {
    title: t("title"),
  };
}
const TasksPage = async () => {
  const tasks = await getTasks();
  const t = await getTranslations("tasks.page");
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>
            {t("title")} <TaskRefreshButton />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TasksDefault />
          <div className="flex justify-end gap-x-2">
            <TaskCreateButton />
          </div>
          <TasksDataTable data={tasks} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TasksPage;
