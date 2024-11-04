"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MaterialUsageTable } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";

import { canUpdateActivityStatus } from "@/lib/permission";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { assign, destroy, revoke } from "@/actions/material-usage";
import { MaterialUsageEditButton } from "@/app/[locale]/(backoffice)/admin/(inventory)/materials/detail/[materialId]/usages/_components/material-usages-edit-button";
import { ActionButton } from "@/components/buttons/action-button";
import { useParams } from "next/navigation";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface ActivityMaterialUsagesTableActionProps {
  data: MaterialUsageTable;
}
export const ActivityMaterialUsagesTableAction = ({
  data,
}: ActivityMaterialUsagesTableActionProps) => {
  const t = useTranslations("materialUsages.form");
  const params = useParams<{
    activityId: string;
  }>()!;
  const { isSuperAdmin, isOnlyAdmin } = useCurrentStaffRole();
  const canEdit =
    !data.activity || canUpdateActivityStatus(data.activity.status);
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
          <MaterialUsageEditButton data={data} disabled={!canUpdate} />
        </DropdownMenuItem>

        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="materialUsages"
            disabled={!canDelete}
            className="w-full"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
