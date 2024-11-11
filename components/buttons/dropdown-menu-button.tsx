"use client";

import { LucideIcon, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { PropsWithChildren } from "react";
interface DropdownMenuButtonProps extends PropsWithChildren {
  icon?: LucideIcon;
}
export const DropdownMenuButton = ({
  children,
  icon,
}: DropdownMenuButtonProps) => {
  const Icon = icon ? icon : MoreHorizontal;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <Icon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
