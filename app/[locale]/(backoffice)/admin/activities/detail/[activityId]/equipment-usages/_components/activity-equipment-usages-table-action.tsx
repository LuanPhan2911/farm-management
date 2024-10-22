"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import { DetailButton } from "@/components/buttons/detail-button";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { assign, destroy, revoke } from "@/actions/equipment-usage";
import { EquipmentUsageTable } from "@/types";
import { useTranslations } from "next-intl";
import {
  canUpdateActivityStatus,
  canUpdateEquipmentUsage,
} from "@/lib/permission";
import { EquipmentUsageEditButton } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/details/[equipmentDetailId]/usages/_components/equipment-usage-edit-button";
import { ActionButton } from "@/components/buttons/action-button";
import { useParams } from "next/navigation";

interface ActivityEquipmentUsagesTableActionProps {
  data: EquipmentUsageTable;
}
export const ActivityEquipmentUsagesTableAction = ({
  data,
}: ActivityEquipmentUsagesTableActionProps) => {
  const t = useTranslations("equipmentUsages.form");
  const params = useParams<{ activityId: string }>()!;
  const canUpdate =
    !data.activity ||
    canUpdateActivityStatus(data.activity.status) ||
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
          {!data.activity ? (
            <ActionButton
              actionFn={() => {
                return assign(data.id, params.activityId);
              }}
              disabled={!canUpdate}
              label={t("assign.label")}
              description={t("assign.description")}
              title={t("assign.title")}
              className="w-full"
            />
          ) : (
            <ActionButton
              actionFn={() => {
                return revoke(data.id, params.activityId);
              }}
              disabled={!canUpdate}
              label={t("revoke.label")}
              description={t("revoke.description")}
              title={t("revoke.title")}
              className="w-full"
            />
          )}
        </DropdownMenuItem>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
