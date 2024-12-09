"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ManagePermission, SaleTableWithCost } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { destroy } from "@/actions/sale";
import { DestroyButtonWithConfirmCode } from "@/components/buttons/destroy-button-with-confirm-code";

interface SalesTableActionProps extends ManagePermission {
  data: SaleTableWithCost;
  disabled?: boolean;
}
export const SalesTableAction = ({
  data,
  disabled,
  canDelete,
}: SalesTableActionProps) => {
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
            inltKey="sales"
            className="w-full"
            confirmCode="DELETE_SALE"
            disabled={!canDelete}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
