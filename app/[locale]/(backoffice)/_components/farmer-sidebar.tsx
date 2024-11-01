"use client";
import { cn, isActive } from "@/lib/utils";
import { usePathname } from "@/navigation";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";

import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { SidebarAccordionItem } from "./sidebar-accordion-item";

import { useEffect } from "react";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/configs/siteConfig";
import { useMedia } from "@/hooks/use-media";
import {
  ArchiveRestore,
  Building,
  MessageCircle,
  SquareUserRound,
} from "lucide-react";
import { useTranslations } from "next-intl";
import {
  BugOff,
  Database,
  Flower2,
  Folder,
  FolderLock,
  Goal,
  Grid2X2,
  Hammer,
  House,
  Leaf,
  Store,
  Trash,
} from "lucide-react";
export const FarmerSidebar = () => {
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
          href="/farmer/activities"
          active={isActive(pathname, "/farmer/activities")}
          icon={Goal}
          title={t("activities")}
        />
        <SidebarItem
          href="/farmer/staffs"
          active={isActive(pathname, "/farmer/staffs")}
          icon={SquareUserRound}
          title={t("staffs")}
        />
        <SidebarItem
          href="/farmer/organizations"
          active={isActive(pathname, "/farmer/organizations")}
          icon={Building}
          title={t("organizations")}
        />
        <SidebarItem
          href="/farmer/messages"
          active={isActive(pathname, "/farmer/messages")}
          icon={MessageCircle}
          title={t("messages")}
        />
        <SidebarAccordionItem title={t("farm")} icon={House}>
          <SidebarItem
            href="/farmer/fields"
            active={isActive(pathname, "/farmer/fields")}
            icon={Grid2X2}
            title={t("fields")}
          />
          <SidebarItem
            href="/farmer/plants"
            active={isActive(pathname, "/farmer/plants")}
            icon={Flower2}
            title={t("plants")}
          />
          <SidebarItem
            href="/farmer/fertilizers"
            active={isActive(pathname, "/farmer/fertilizers")}
            icon={Leaf}
            title={t("fertilizers")}
          />
          <SidebarItem
            href="/farmer/pesticides"
            active={isActive(pathname, "/farmer/pesticides")}
            icon={BugOff}
            title={t("pesticides")}
          />
        </SidebarAccordionItem>

        <SidebarAccordionItem title={t("inventory")} icon={Store}>
          <SidebarItem
            href="/farmer/materials"
            active={isActive(pathname, "/farmer/materials")}
            icon={Database}
            title={t("materials")}
          />
          <SidebarItem
            href="/farmer/equipments"
            active={isActive(pathname, "/farmer/equipments")}
            icon={Hammer}
            title={t("equipments")}
          />
        </SidebarAccordionItem>
        <SidebarAccordionItem title={t("storage")} icon={ArchiveRestore}>
          <SidebarItem
            href="/farmer/my-files"
            active={isActive(pathname, "/farmer/my-files")}
            icon={FolderLock}
            title={t("my-files")}
          />
          <SidebarItem
            href="/farmer/public-files"
            active={isActive(pathname, "/farmer/public-files")}
            icon={Folder}
            title={t("public-files")}
          />
          <SidebarItem
            href="/farmer/my-trash"
            active={isActive(pathname, "/farmer/my-trash")}
            icon={Trash}
            title={t("my-trash")}
          />
        </SidebarAccordionItem>
      </div>
    </div>
  );
};
