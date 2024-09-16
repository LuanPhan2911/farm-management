"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FertilizerTable } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { FertilizerEditButton } from "./fertilizer-edit-button";
import { FertilizerDeleteButton } from "./fertilizer-delete-button";
interface FertilizersTableActionProps {
  data: FertilizerTable;
}
export const FertilizersTableAction = ({
  data,
}: FertilizersTableActionProps) => {
  const t = useTranslations("fertilizers.form");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        <DropdownMenuItem>
          <FertilizerEditButton data={data} label={t("edit.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <FertilizerDeleteButton data={data} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
