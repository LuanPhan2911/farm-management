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
import { useTranslations } from "next-intl";
import { useSidebarItem } from "@/hooks/use-sidebar-item";

export const AdminSidebar = () => {
  const { isOpen, onClose } = useDashboardSidebar();
  const { isMobile } = useMedia();
  const pathname = usePathname();

  const t = useTranslations("sidebar");

  const { adminSidebar } = useSidebarItem();
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
        {adminSidebar.map((group) => {
          const { icon, items, title, href } = group;
          if (!items.length) {
            return (
              <SidebarItem
                key={title}
                href={href as string}
                active={isActive(pathname, href as string)}
                icon={icon}
                title={title}
              />
            );
          }
          return (
            <SidebarAccordionItem title={title} icon={icon} key={title}>
              {items.map((item) => {
                return (
                  <SidebarItem
                    key={item.href}
                    href={item.href as string}
                    active={isActive(pathname, item.href as string)}
                    icon={item.icon}
                    title={item.title}
                  />
                );
              })}
            </SidebarAccordionItem>
          );
        })}
      </div>
    </div>
  );
};
