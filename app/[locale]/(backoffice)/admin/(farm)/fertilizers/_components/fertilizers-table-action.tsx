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
import { FertilizerEditButton } from "./fertilizer-edit-button";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/fertilizer";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { DestroyButtonWithConfirmCode } from "@/components/buttons/destroy-button-with-confirm-code";
interface FertilizersTableActionProps {
  data: FertilizerTable;
}
export const FertilizersTableAction = ({
  data,
}: FertilizersTableActionProps) => {
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
          <FertilizerEditButton data={data} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButtonWithConfirmCode
            destroyFn={destroy}
            id={data.id}
            inltKey="fertilizers"
            disabled={!canDelete}
            className="w-full"
            confirmCode="DELETE_FERTILIZER"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
