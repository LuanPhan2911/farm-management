"use client";
import { cn, isActive } from "@/lib/utils";
import { usePathname } from "@/navigation";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";
import {
  ArchiveRestore,
  BookCheck,
  BugOff,
  Building,
  Clipboard,
  Clock,
  Compass,
  Database,
  Flower,
  Flower2,
  Folder,
  FolderLock,
  Goal,
  Grid2X2,
  Hammer,
  House,
  LayoutGrid,
  Leaf,
  MessageCircle,
  MountainSnow,
  ScrollText,
  Section,
  SquareUserRound,
  Store,
  Trash,
  User,
  Users,
  Vegan,
} from "lucide-react";

import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { SidebarAccordionItem } from "./sidebar-accordion-item";

import { useEffect } from "react";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/configs/siteConfig";
import { useMedia } from "@/hooks/use-media";
import { useTranslations } from "next-intl";

export const AdminSidebar = () => {
  const { isOpen, onClose } = useDashboardSidebar();
  const { isMobile } = useMedia();
  const pathname = usePathname();

  const t = useTranslations("sidebar");
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
          title={t("dashboard")}
        />

        <SidebarItem
          href="/admin/crops"
          active={isActive(pathname, "/admin/crops")}
          icon={Vegan}
          title={t("crops")}
        />
        <SidebarItem
          href="/admin/activities"
          active={isActive(pathname, "/admin/activities")}
          icon={Goal}
          title={t("activities")}
        />
        <SidebarAccordionItem title={t("account")} icon={Users}>
          <SidebarItem
            href="/admin/users"
            active={isActive(pathname, "/admin/users")}
            icon={User}
            title={t("users")}
          />
          <SidebarItem
            href="/admin/staffs"
            active={isActive(pathname, "/admin/staffs")}
            icon={SquareUserRound}
            title={t("staffs")}
          />

          <SidebarItem
            href="/admin/organizations"
            active={isActive(pathname, "/admin/organizations")}
            icon={Building}
            title={t("organizations")}
          />
          <SidebarItem
            href="/admin/messages"
            active={isActive(pathname, "/admin/messages")}
            icon={MessageCircle}
            title={t("messages")}
          />
        </SidebarAccordionItem>

        <SidebarAccordionItem title={t("farm")} icon={House}>
          <SidebarItem
            href="/admin/fields"
            active={isActive(pathname, "/admin/fields")}
            icon={Grid2X2}
            title={t("fields")}
          />
          <SidebarItem
            href="/admin/plants"
            active={isActive(pathname, "/admin/plants")}
            icon={Flower2}
            title={t("plants")}
          />
          <SidebarItem
            href="/admin/fertilizers"
            active={isActive(pathname, "/admin/fertilizers")}
            icon={Leaf}
            title={t("fertilizers")}
          />
          <SidebarItem
            href="/admin/pesticides"
            active={isActive(pathname, "/admin/pesticides")}
            icon={BugOff}
            title={t("pesticides")}
          />
        </SidebarAccordionItem>
        <SidebarAccordionItem title={t("inventory")} icon={Store}>
          <SidebarItem
            href="/admin/materials"
            active={isActive(pathname, "/admin/materials")}
            icon={Database}
            title={t("materials")}
          />
          <SidebarItem
            href="/admin/equipments"
            active={isActive(pathname, "/admin/equipments")}
            icon={Hammer}
            title={t("equipments")}
          />
        </SidebarAccordionItem>
        <SidebarAccordionItem title={t("catalogue")} icon={Flower}>
          <SidebarItem
            href="/admin/categories"
            active={isActive(pathname, "/admin/categories")}
            icon={Section}
            title={t("categories")}
          />
          <SidebarItem
            href="/admin/units"
            active={isActive(pathname, "/admin/units")}
            icon={MountainSnow}
            title={t("units")}
          />
        </SidebarAccordionItem>

        <SidebarAccordionItem title={t("recruit")} icon={Clipboard}>
          <SidebarItem
            href="/admin/jobs"
            active={isActive(pathname, "/admin/jobs")}
            icon={Compass}
            title={t("jobs")}
          />
          <SidebarItem
            href="/admin/applicants"
            active={isActive(pathname, "/admin/applicants")}
            icon={User}
            title={t("applicants")}
          />
        </SidebarAccordionItem>
        <SidebarAccordionItem title={t("cron-job")} icon={ScrollText}>
          <SidebarItem
            href="/admin/tasks"
            active={isActive(pathname, "/admin/tasks")}
            icon={BookCheck}
            title={t("tasks")}
          />
          <SidebarItem
            href="/admin/schedules"
            active={isActive(pathname, "/admin/schedules")}
            icon={Clock}
            title={t("schedules")}
          />
        </SidebarAccordionItem>

        <SidebarAccordionItem title={t("storage")} icon={ArchiveRestore}>
          <SidebarItem
            href="/admin/my-files"
            active={isActive(pathname, "/admin/my-files")}
            icon={FolderLock}
            title={t("my-files")}
          />
          <SidebarItem
            href="/admin/public-files"
            active={isActive(pathname, "/admin/public-files")}
            icon={Folder}
            title={t("public-files")}
          />
          <SidebarItem
            href="/admin/my-trash"
            active={isActive(pathname, "/admin/my-trash")}
            icon={Trash}
            title={t("my-trash")}
          />
        </SidebarAccordionItem>
      </div>
    </div>
  );
};
