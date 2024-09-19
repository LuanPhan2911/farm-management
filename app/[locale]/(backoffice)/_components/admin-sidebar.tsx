"use client";
import { cn, isActive } from "@/lib/utils";
import { usePathname } from "@/navigation";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";
import {
  BugOff,
  Building,
  Clipboard,
  Columns2,
  Compass,
  Flower,
  Flower2,
  Globe,
  Grid2X2,
  Hammer,
  House,
  LayoutGrid,
  Leaf,
  MountainSnow,
  Section,
  Settings,
  SquareUserRound,
  Store,
  User,
  UserCheck,
  UserCog,
  Users,
} from "lucide-react";

import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { SidebarAccordionItem } from "./sidebar-accordion-item";

import { useEffect } from "react";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/configs/siteConfig";
import { useMedia } from "@/hooks/use-media";

export const AdminSidebar = () => {
  const { isOpen, onClose } = useDashboardSidebar();
  const { isMobile } = useMedia();
  const pathname = usePathname();

  useEffect(() => {
    if (isMobile) {
      onClose();
    }
  }, [isMobile, onClose]);
  return (
    <div
      className={cn(
        "space-y-6 w-60 h-full px-2 py-6 fixed sm:top-0 top-16 left-0 transition-all z-50 overflow-y-auto",
        !isOpen && "hidden",
        "custom-scrollbar border-r rounded-md shadow-md bg-background"
      )}
    >
      <Link href={"/"} className="flex items-center ml-2">
        <Icons.logo height={24} width={24} />
        <span className="font-bold">{siteConfig.name}</span>
      </Link>
      <div className="flex flex-col gap-y-2">
        <SidebarItem
          href="/admin/dashboard"
          active={isActive(pathname, "/admin/dashboard")}
          icon={LayoutGrid}
          title="Dashboard"
        />
        <SidebarAccordionItem title="Account" icon={Users}>
          <SidebarItem
            href="/admin/users"
            active={isActive(pathname, "/admin/users")}
            icon={User}
            title="Users"
          />
          <SidebarItem
            href="/admin/staffs"
            active={isActive(pathname, "/admin/staffs")}
            icon={SquareUserRound}
            title="Staffs"
          />

          <SidebarItem
            href="/admin/organizations"
            active={isActive(pathname, "/admin/organizations")}
            icon={Building}
            title="Organizations"
          />
        </SidebarAccordionItem>

        <SidebarAccordionItem title="Farm" icon={House}>
          <SidebarItem
            href="/admin/fields"
            active={isActive(pathname, "/admin/fields")}
            icon={Grid2X2}
            title="Fields"
          />
          <SidebarItem
            href="/admin/plants"
            active={isActive(pathname, "/admin/plants")}
            icon={Flower2}
            title="Plants"
          />
          <SidebarItem
            href="/admin/fertilizers"
            active={isActive(pathname, "/admin/fertilizers")}
            icon={Leaf}
            title="Fertilizers"
          />
          <SidebarItem
            href="/admin/pesticides"
            active={isActive(pathname, "/admin/pesticides")}
            icon={BugOff}
            title="Pesticides"
          />
          <SidebarItem
            href="/admin/equipments"
            active={isActive(pathname, "/admin/equipments")}
            icon={Hammer}
            title="Equipments"
          />
        </SidebarAccordionItem>
        <SidebarAccordionItem title="Catalogue" icon={Flower}>
          <SidebarItem
            href="/admin/categories"
            active={isActive(pathname, "/admin/categories")}
            icon={Section}
            title="Categories"
          />
          <SidebarItem
            href="/admin/units"
            active={isActive(pathname, "/admin/units")}
            icon={MountainSnow}
            title="Units"
          />
        </SidebarAccordionItem>

        <SidebarAccordionItem title="Recruit" icon={Clipboard}>
          <SidebarItem
            href="/admin/jobs"
            active={isActive(pathname, "/admin/jobs")}
            icon={Compass}
            title="Jobs"
          />
          <SidebarItem
            href="/admin/applicants"
            active={isActive(pathname, "/admin/applicants")}
            icon={User}
            title="Applicants"
          />
        </SidebarAccordionItem>

        {/* <SidebarItem
        href="/dashboard/staff"
        active={pathname === "/dashboard/staff"}
        icon={User}
        title="Our staff"
      />
      <SidebarItem
        href="/dashboard/settings"
        active={pathname === "/dashboard/settings"}
        icon={Settings}
        title="Settings"
      />

      <SidebarAccordionItem title="International" icon={Globe}>
        <div></div>
      </SidebarAccordionItem>
      <SidebarAccordionItem title="Online stores" icon={Store}>
        <div></div>
      </SidebarAccordionItem>
      <SidebarAccordionItem title="Pages" icon={Columns2}>
        <div></div>
      </SidebarAccordionItem> */}
      </div>
    </div>
  );
};
