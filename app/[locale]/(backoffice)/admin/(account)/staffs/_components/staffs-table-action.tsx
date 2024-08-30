"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import { User } from "@clerk/nextjs/server";
import { StaffDeleteButton } from "./staff-delele-button";

interface StaffsTableActionProps {
  data: User;
}
export const StaffsTableAction = ({ data: staff }: StaffsTableActionProps) => {
  const t = useTranslations("staffs.form");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <StaffDeleteButton data={staff} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
