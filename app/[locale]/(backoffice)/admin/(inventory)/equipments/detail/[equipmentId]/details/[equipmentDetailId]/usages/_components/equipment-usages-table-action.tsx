"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { EquipmentUsageEditButton } from "./equipment-usage-edit-button";
import { DetailButton } from "@/components/buttons/detail-button";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/equipment-usage";
import { EquipmentUsageTable } from "@/types";
import { useTranslations } from "next-intl";
import {
  canUpdateActivityStatus,
  canUpdateEquipmentUsage,
} from "@/lib/permission";

interface EquipmentUsagesTableActionProps {
  data: EquipmentUsageTable;
}
export const EquipmentUsagesTableAction = ({
  data,
}: EquipmentUsagesTableActionProps) => {
  const t = useTranslations("equipmentUsages.form");
  const canUpdate =
    canUpdateActivityStatus(data.activity.status) &&
    canUpdateEquipmentUsage(data.equipmentDetail.status);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <EquipmentUsageEditButton
            data={data}
            label={t("edit.label")}
            disabled={!canUpdate}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="equipmentUsages"
            disabled={!canUpdate}
            className="w-full"
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DetailButton
            href={`/admin/activities/detail/${data.activity.id}`}
            label={t("detailActivity.label")}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
