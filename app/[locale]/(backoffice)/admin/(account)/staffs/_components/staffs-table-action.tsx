"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import { User } from "@clerk/nextjs/server";
import { StaffEditRoleButton } from "./staff-edit-role";
import { isSuperAdmin } from "@/lib/permission";
import { StaffRole } from "@prisma/client";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/staff";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
interface StaffsTableActionProps {
  data: User;
}
export const StaffsTableAction = ({ data }: StaffsTableActionProps) => {
  const t = useTranslations("staffs.form");
  const isSuperAdminRole = isSuperAdmin(data.publicMetadata.role as StaffRole);
  const { isSuperAdmin: canDelete } = useCurrentStaffRole();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <StaffEditRoleButton data={data} label={t("editRole.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <DestroyButton
            destroyFn={destroy}
            id={data.id}
            inltKey="staffs"
            className="w-full"
            disabled={isSuperAdminRole || !canDelete}
            redirectHref="staffs"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
