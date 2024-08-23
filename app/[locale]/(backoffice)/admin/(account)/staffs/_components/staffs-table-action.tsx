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
  const tAction = useTranslations("staffs.table.action");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{tAction("label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <StaffDeleteButton data={staff} label={tAction("destroy")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
