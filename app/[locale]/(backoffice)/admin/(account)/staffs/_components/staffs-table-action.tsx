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
import { StaffDeleteButton } from "./staff-delele-button";
import { StaffEditRole } from "./staff-edit-role";

interface StaffsTableActionProps {
  data: User;
}
export const StaffsTableAction = ({ data: staff }: StaffsTableActionProps) => {
  const t = useTranslations("staffs.form");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <StaffEditRole data={staff} label={t("editRole.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <StaffDeleteButton data={staff} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
