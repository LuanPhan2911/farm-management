"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SoilTable } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { SoilEditButton } from "./soil-edit-button";
import { SoilDeleteButton } from "./soil-delete-button";
import { SoilPinnedButton } from "./soil-pinned-button";
import { SoilConfirmButton } from "./soil-confirm-button";
interface SoilsTableActionProps {
  data: SoilTable;
}
export const SoilsTableAction = ({ data }: SoilsTableActionProps) => {
  const t = useTranslations("soils.form");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <SoilPinnedButton data={data} isButton />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SoilConfirmButton data={data} isButton />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SoilEditButton data={data} label={t("edit.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SoilDeleteButton data={data} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
