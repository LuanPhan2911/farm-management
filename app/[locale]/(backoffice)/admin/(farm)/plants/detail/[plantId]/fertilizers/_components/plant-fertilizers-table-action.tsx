"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlantFertilizerTable } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { PlantFertilizerEditButton } from "./plant-fertilizers-edit-button";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/plant-fertilizer";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface PlantFertilizersTableActionProps {
  data: PlantFertilizerTable;
}
export const PlantFertilizersTableAction = ({
  data,
}: PlantFertilizersTableActionProps) => {
  const t = useTranslations("plantFertilizers.form");
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
          <PlantFertilizerEditButton data={data} label={t("edit.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="plantFertilizers"
            disabled={!canDelete}
            className="w-full"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
