"use client";
import { cn, isActive } from "@/lib/utils";
import { usePathname } from "@/navigation";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";
import {
  BookCheck,
  BugOff,
  Building,
  Clipboard,
  Clock,
  CloudUpload,
  Columns2,
  Compass,
  Flower,
  Flower2,
  Folder,
  Globe,
  Grid2X2,
  Hammer,
  House,
  LayoutGrid,
  Leaf,
  MessageCircle,
  MountainSnow,
  ScrollText,
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
          <SidebarItem
            href="/admin/messages"
            active={isActive(pathname, "/admin/messages")}
            icon={MessageCircle}
            title="Messages"
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
        <SidebarAccordionItem icon={ScrollText} title="Cron Job">
          <SidebarItem
            href="/admin/tasks"
            active={isActive(pathname, "/admin/tasks")}
            icon={BookCheck}
            title="Tasks"
          />
          <SidebarItem
            href="/admin/schedules"
            active={isActive(pathname, "/admin/schedules")}
            icon={Clock}
            title="Schedules"
          />
        </SidebarAccordionItem>

        <SidebarAccordionItem title="Files" icon={CloudUpload}>
          <SidebarItem
            href="/admin/my-files"
            active={isActive(pathname, "/admin/my-files")}
            icon={Folder}
            title="My files"
          />
          <SidebarItem
            href="/admin/public-files"
            active={isActive(pathname, "/admin/public-files")}
            icon={Folder}
            title="Public files"
          />
        </SidebarAccordionItem>
      </div>
    </div>
  );
};
