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
import { MaterialUsageEditButton } from "./material-usages-edit-button";
import { canUpdateActivityStatus } from "@/lib/permission";
import { LinkButton } from "@/components/buttons/link-button";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/material-usage";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface MaterialUsagesTableActionProps {
  data: MaterialUsageTable;
}
export const MaterialUsagesTableAction = ({
  data,
}: MaterialUsagesTableActionProps) => {
  const t = useTranslations("materialUsages.form");
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
        {data.activity && (
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
