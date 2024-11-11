"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import { isSuperAdmin } from "@/lib/permission";
import { Staff } from "@prisma/client";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/staff";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { StaffEditButton } from "./staff-edit-button";
import { useCurrentStaff } from "@/hooks/use-current-staff";
interface StaffsTableActionProps {
  data: Staff;
}
export const StaffsTableAction = ({ data }: StaffsTableActionProps) => {
  const t = useTranslations("staffs.form");
  const { currentStaff } = useCurrentStaff();
  const { isSuperAdmin: isSuperAdminRole } = useCurrentStaffRole();

  const isOwner = currentStaff?.id === data.id;

  const canEdit = isSuperAdminRole || isOwner;
  const staffIsSuperAdmin = isSuperAdmin(data.role);
  const canDelete = isSuperAdminRole && !staffIsSuperAdmin;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <StaffEditButton data={data} disabled={!canEdit} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="staffs"
            className="w-full"
            disabled={!canDelete}
            redirectHref="staffs"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
