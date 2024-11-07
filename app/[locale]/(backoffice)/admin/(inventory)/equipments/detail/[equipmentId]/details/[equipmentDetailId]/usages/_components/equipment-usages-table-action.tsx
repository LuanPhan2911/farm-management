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
import { LinkButton } from "@/components/buttons/link-button";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { assign, destroy, revoke } from "@/actions/equipment-usage";
import { EquipmentUsageTable } from "@/types";
import { useTranslations } from "next-intl";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { canUpdateActivityStatus } from "@/lib/permission";
import { useParams } from "next/navigation";
import { ActionButton } from "@/components/buttons/action-button";

interface EquipmentUsagesTableActionProps {
  data: EquipmentUsageTable;
}
export const EquipmentUsagesTableAction = ({
  data,
}: EquipmentUsagesTableActionProps) => {
  const t = useTranslations("equipmentUsages.form");
  const { isSuperAdmin, isOnlyAdmin } = useCurrentStaffRole();
  const params = useParams<{ activityId: string }>()!;

  const canAssign =
    data.activity === null ||
    (data.activity && canUpdateActivityStatus(data.activity.status));
  const canUpdate = data.activity === null && isOnlyAdmin;
  const canDelete = canUpdate && isSuperAdmin;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        {params.activityId && (
          <DropdownMenuItem>
            {!data.activity ? (
              <ActionButton
                actionFn={() => {
                  return assign(data.id, params.activityId);
                }}
                disabled={!canAssign}
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
                disabled={!canAssign}
                label={t("revoke.label")}
                description={t("revoke.description")}
                title={t("revoke.title")}
                className="w-full"
              />
            )}
          </DropdownMenuItem>
        )}
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
        {!params.activityId && data.activity && (
          <DropdownMenuItem>
            <LinkButton
              href={`activities/detail/${data.activity.id}`}
              label={t("detailActivity.label")}
            />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
