"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { MoreHorizontal } from "lucide-react";

import { useTranslations } from "next-intl";
import { TaskResponse } from "@/types";
import { TaskDeleteButton } from "./task-delete-button";
import { TaskRunButton } from "./task-run-button";
interface TasksTableActionProps {
  data: TaskResponse;
}
export const TasksTableAction = ({ data }: TasksTableActionProps) => {
  const t = useTranslations("tasks.form");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <TaskRunButton data={data} label={t("run.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <TaskDeleteButton data={data} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
