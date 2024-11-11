"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlantPesticideTable } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { PlantPesticideEditButton } from "./plant-pesticides-edit-button";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/plant-pesticide";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface PlantPesticidesTableActionProps {
  data: PlantPesticideTable;
}
export const PlantPesticidesTableAction = ({
  data,
}: PlantPesticidesTableActionProps) => {
  const { isSuperAdmin: canDelete } = useCurrentStaffRole();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <PlantPesticideEditButton data={data} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="plantPesticides"
            disabled={!canDelete}
            className="w-full"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
