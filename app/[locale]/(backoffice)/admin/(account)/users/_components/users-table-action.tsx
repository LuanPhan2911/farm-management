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
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/user";
import { StaffEditRoleButton } from "../../staffs/_components/staff-edit-role";
interface UsersTableActionProps {
  data: User;
}
export const UsersTableAction = ({ data }: UsersTableActionProps) => {
  const t = useTranslations("users.form");
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
            inltKey="users"
            className="w-full"
            disabled={!canDelete}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
