"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { MoreHorizontal, Play } from "lucide-react";

import { useTranslations } from "next-intl";
import { TaskResponse } from "@/types";
import { destroy, run } from "@/actions/task";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { ActionButton } from "@/components/buttons/action-button";
interface TasksTableActionProps {
  data: TaskResponse;
}
export const TasksTableAction = ({ data }: TasksTableActionProps) => {
  const t = useTranslations("tasks.form");
  const disabled = data.status !== "queued";
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <ActionButton
            actionFn={() => run(data.id)}
            label={t("run.label")}
            title={t("run.title")}
            description={t("run.description")}
            className="w-full"
            icon={Play}
            variant={"blue"}
            size={"sm"}
            disabled={disabled}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="tasks"
            className="w-full"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
