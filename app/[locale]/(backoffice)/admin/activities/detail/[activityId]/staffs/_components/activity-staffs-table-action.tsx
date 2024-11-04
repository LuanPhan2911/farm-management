"use client";

import { deleteAssigned } from "@/actions/activity";
import { ActionButton } from "@/components/buttons/action-button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { Staff } from "@prisma/client";
import { MoreHorizontal, Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
interface ActivityStaffTableActionProps {
  data: Staff;
}
export const ActivityStaffsTableAction = ({
  data,
}: ActivityStaffTableActionProps) => {
  const t = useTranslations("activities.form");
  const params = useParams<{ activityId: string }>();
  const { isOnlyAdmin } = useCurrentStaffRole();
  const canDelete = isOnlyAdmin;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <ActionButton
            actionFn={() => deleteAssigned(params!.activityId, data.id)}
            title={t("deleteAssigned.title")}
            label={t("deleteAssigned.label")}
            description={t("deleteAssigned.description")}
            className="w-full"
            icon={Trash}
            variant={"destroy"}
            disabled={!canDelete}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
