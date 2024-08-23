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
import { UserDeleteButton } from "./user-delete-button";
import { useTranslations } from "next-intl";
import { User } from "@clerk/nextjs/server";

interface UsersTableActionProps {
  data: User;
}
export const UsersTableAction = ({ data: user }: UsersTableActionProps) => {
  const tAction = useTranslations("users.table.action");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{tAction("label")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <UserDeleteButton data={user} label={tAction("destroy")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
