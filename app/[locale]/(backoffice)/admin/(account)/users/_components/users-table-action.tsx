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
import { DestroyButtonWithConfirmCode } from "@/components/buttons/destroy-button-with-confirm-code";
interface UsersTableActionProps {
  data: User;
}
export const UsersTableAction = ({ data }: UsersTableActionProps) => {
  const { isSuperAdmin } = useCurrentStaffRole();
  const canDelete = isSuperAdmin;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <DestroyButtonWithConfirmCode
            destroyFn={destroy}
            id={data.id}
            inltKey="users"
            className="w-full"
            disabled={!canDelete}
            confirmCode="DELETE_USER"
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
