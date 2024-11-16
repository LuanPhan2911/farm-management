"use client";

import { deleteAssigned } from "@/actions/activity-assigned";
import { ActionButton } from "@/components/buttons/action-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { StaffWithSalaryAndActivity } from "@/types";
import { MoreHorizontal, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { ActivityStaffsEditButton } from "./activity-staffs-edit-button";
import { canUpdateActivityStatus } from "@/lib/permission";
interface ActivityStaffTableActionProps {
  data: StaffWithSalaryAndActivity;
  disabled?: boolean;
}
export const ActivityStaffsTableAction = ({
  data,
  disabled,
}: ActivityStaffTableActionProps) => {
  const t = useTranslations("activityAssigned.form");
  const params = useParams<{ activityId: string }>();
  const { isOnlyAdmin } = useCurrentStaffRole();
  const canEdit = canUpdateActivityStatus(data.activity.status) && isOnlyAdmin;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0" disabled={disabled}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <ActivityStaffsEditButton data={data} disabled={!canEdit} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <ActionButton
            actionFn={() => deleteAssigned(params!.activityId, data.staffId)}
            title={t("destroy.title")}
            label={t("destroy.label")}
            description={t("destroy.description")}
            className="w-full"
            icon={Trash}
            variant={"destroy"}
            disabled={!canEdit}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
