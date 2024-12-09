"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HarvestTable, ManagePermission } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { destroy } from "@/actions/harvest";
import { DestroyButtonWithConfirmCode } from "@/components/buttons/destroy-button-with-confirm-code";

interface HarvestsTableActionProps extends ManagePermission {
  data: HarvestTable;
  disabled?: boolean;
}
export const HarvestsTableAction = ({
  data,
  disabled,
  canDelete,
}: HarvestsTableActionProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={disabled}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <DestroyButtonWithConfirmCode
            destroyFn={destroy}
            id={data.id}
            inltKey="harvests"
            className="w-full"
            confirmCode="DELETE_HARVEST"
            disabled={!canDelete}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
