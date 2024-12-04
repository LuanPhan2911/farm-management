"use client";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { ModeToggle } from "@/components/mode-toggle";
import { ProfileButton } from "@/components/profile-button";
import { cn } from "@/lib/utils";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";
import { BreadcrumbResponsive } from "./breadcrumb-responsive";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { usePrefix } from "@/hooks/use-prefix";
import { CommandMenu } from "./command-menu";

export const Navbar = () => {
  const { isOpen, onToggle } = useDashboardSidebar();
  const { isSuperAdmin } = useCurrentStaffRole();
  const prefix = usePrefix();
  return (
    <div
      className={cn(
        "flex items-center gap-x-2 lg:justify-between py-4 px-6 h-16 shadow-md backdrop-blur-sm",
        "fixed top-0 z-[2000] transition-all w-full right-0 border-r border-t border-b rounded-sm",

        isOpen && "sm:left-60 left-0 w-auto"
      )}
    >
      <div className="flex gap-x-2 items-center ">
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
      <div className="flex flex-1 gap-x-2 items-center justify-end">
        <CommandMenu />

        <div className="lg:flex lg:gap-x-2 hidden">
          <LocaleSwitcher />
          <ModeToggle />
        </div>
        <Button
          variant={"outline"}
          className="dark:bg-slate-300 lg:block hidden"
        >
          <OrganizationSwitcher
            skipInvitationScreen
            appearance={{
              elements: {
                organizationSwitcherPopoverActionButton:
                  !isSuperAdmin && "hidden",
              },
            }}
            afterLeaveOrganizationUrl={`${prefix}/`}
          />
        </Button>
        <ProfileButton />
      </div>
    </div>
  );
};
