"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ManagePermission, MaterialUsageTable } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { MaterialUsageEditButton } from "./material-usages-edit-button";
import { LinkButton } from "@/components/buttons/link-button";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { assign, destroy, revoke } from "@/actions/material-usage";
import { canUpdateActivityStatus } from "@/lib/permission";
import { useParams } from "next/navigation";
import { ActionButton } from "@/components/buttons/action-button";

interface MaterialUsagesTableActionProps extends ManagePermission {
  data: MaterialUsageTable;
  disabled?: boolean;
}
export const MaterialUsagesTableAction = ({
  data,
  disabled,
  canEdit,
}: MaterialUsagesTableActionProps) => {
  const t = useTranslations("materialUsages.form");
  const params = useParams<{ activityId: string }>()!;
  const canAssign =
    data.activity === null ||
    (data.activity && canUpdateActivityStatus(data.activity.status));

  const canUpdate = data.activity === null && canEdit;
  const canDelete = canUpdate;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={disabled}>
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
                  return revoke(data.id, params.activityId);
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
        {data.activity && !params.activityId && (
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
