"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CropTable } from "@/types";
import { Check, MoreHorizontal } from "lucide-react";
import { CropEditButton } from "./crop-edit-button";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/crop";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { LinkButton } from "@/components/buttons/link-button";
import { useTranslations } from "next-intl";
interface CropsTableActionProps {
  data: CropTable;
}
export const CropsTableAction = ({ data }: CropsTableActionProps) => {
  const { isSuperAdmin: canUpdate } = useCurrentStaffRole();
  const t = useTranslations("crops.form");
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
            href={`crops/detail/${data.id}`}
            label={t("detail.label")}
            className="w-full"
            icon={Check}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <CropEditButton data={data} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="crops"
            className="w-full"
            disabled={!canUpdate}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
