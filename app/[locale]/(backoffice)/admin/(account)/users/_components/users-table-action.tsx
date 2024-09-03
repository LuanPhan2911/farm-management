"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
  const t = useTranslations("users.form");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Ellipsis className="h-6 w-6" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <UserDeleteButton data={user} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
