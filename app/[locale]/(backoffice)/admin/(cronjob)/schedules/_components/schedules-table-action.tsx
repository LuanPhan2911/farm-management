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
import { ScheduleResponse } from "@/types";
import { ScheduleDeleteButton } from "./schedule-delete-button";
interface SchedulesTableActionProps {
  data: ScheduleResponse;
}
export const SchedulesTableAction = ({ data }: SchedulesTableActionProps) => {
  const t = useTranslations("schedules.form");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <ScheduleDeleteButton data={data} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
