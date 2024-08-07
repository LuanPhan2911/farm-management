"use client";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { ProfileButton } from "@/components/profile-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";
import { Notification } from "./notification";
import { Menu } from "lucide-react";
import { BreadcrumbResponsive } from "./breadcrumb-responsive";

export const Navbar = () => {
  const { isOpen, onToggle } = useDashboardSidebar();
  return (
    <div
      className={cn(
        "flex items-center justify-between py-4 px-6 bg-slate-600 h-16",
        "fixed top-0 z-50 transition-all w-full right-0",
        isOpen && "sm:left-72 left-0 w-auto"
      )}
    >
      <div className="flex gap-x-4 items-center">
        <Button
          size={"icon"}
          variant={"outline"}
          onClick={() => onToggle(isOpen)}
        >
          <Menu />
        </Button>
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
