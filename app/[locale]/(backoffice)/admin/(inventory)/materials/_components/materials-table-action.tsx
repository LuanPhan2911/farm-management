"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MaterialTable } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { LinkButton } from "@/components/buttons/link-button";
import { useTranslations } from "next-intl";
interface MaterialsTableActionProps {
  data: MaterialTable;
}
export const MaterialsTableAction = ({ data }: MaterialsTableActionProps) => {
  const t = useTranslations("materials.form");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <LinkButton
            href={`materials/detail/${data.id}`}
            label={t("detail.label")}
            className="w-full"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
