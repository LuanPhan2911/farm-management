"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

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
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface ActivityEquipmentUsagesTableActionProps {
  data: EquipmentUsageTable;
}
export const ActivityEquipmentUsagesTableAction = ({
  data,
}: ActivityEquipmentUsagesTableActionProps) => {
  const t = useTranslations("equipmentUsages.form");
  const params = useParams<{ activityId: string }>()!;

  const { isSuperAdmin, isOnlyAdmin } = useCurrentStaffRole();
  const canEdit =
    !data.activity ||
    canUpdateActivityStatus(data.activity.status) ||
    canUpdateEquipmentUsage(data.equipmentDetail.status);
  const canUpdate = canEdit && isOnlyAdmin;
  const canDelete = canEdit && isSuperAdmin;
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
                return revoke(data.id);
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
          <EquipmentUsageEditButton data={data} disabled={!canUpdate} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="equipmentUsages"
            disabled={!canDelete}
            className="w-full"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
