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
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/fertilizer";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
interface FertilizersTableActionProps {
  data: FertilizerTable;
}
export const FertilizersTableAction = ({
  data,
}: FertilizersTableActionProps) => {
  const t = useTranslations("fertilizers.form");
  const { isSuperAdmin: canDelete } = useCurrentStaffRole();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <FertilizerEditButton data={data} label={t("edit.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="fertilizers"
            disabled={!canDelete}
            className="w-full"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
