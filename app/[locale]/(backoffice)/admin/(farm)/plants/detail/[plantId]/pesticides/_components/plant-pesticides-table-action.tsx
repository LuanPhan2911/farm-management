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
import { useTranslations } from "next-intl";
import { PlantPesticideEditButton } from "./plant-pesticides-edit-button";
import { PlantPesticideDeleteButton } from "./plant-pesticide-delete-button";

interface PlantPesticidesTableActionProps {
  data: PlantPesticideTable;
}
export const PlantPesticidesTableAction = ({
  data,
}: PlantPesticidesTableActionProps) => {
  const t = useTranslations("plantPesticides.form");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <PlantPesticideEditButton data={data} label={t("edit.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <PlantPesticideDeleteButton data={data} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
