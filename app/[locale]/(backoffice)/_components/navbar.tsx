"use client";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { ProfileButton } from "@/components/profile-button";
import { cn } from "@/lib/utils";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";
import { Notification } from "./notification";
import { BreadcrumbResponsive } from "./breadcrumb-responsive";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Navbar = () => {
  const { isOpen, onToggle } = useDashboardSidebar();
  return (
    <div
      className={cn(
        "flex items-center justify-between py-4 px-6 h-16 shadow-md backdrop-blur-sm",
        "fixed top-0 z-50 transition-all w-full right-0 border-r border-t border-b rounded-sm",

        isOpen && "sm:left-60 left-0 w-auto"
      )}
    >
      <div className="flex gap-x-4 items-center">
        <div className="flex gap-x-2">
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={() => onToggle(isOpen)}
          >
            <Menu />
          </Button>
        </div>
        <div className="hidden lg:block">
          <BreadcrumbResponsive />
        </div>
      </div>
      <div className="flex gap-x-4">
        <LocaleSwitcher />
        <ModeToggle />
        <Notification />
        <ProfileButton />
      </div>
    </div>
  );
};
