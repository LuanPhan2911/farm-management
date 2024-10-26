"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ActivityTable } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { DetailButton } from "@/components/buttons/detail-button";
interface ActivitiesTableActionProps {
  data: ActivityTable;
}
export const ActivitiesTableAction = ({ data }: ActivitiesTableActionProps) => {
  const t = useTranslations("activities.form");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <DetailButton
            href={`/admin/activities/detail/${data.id}`}
            label={t("viewDetail.label")}
            className="w-full"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
