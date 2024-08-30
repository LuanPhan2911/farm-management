"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "@/navigation";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";

import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { SidebarAccordionItem } from "./sidebar-accordion-item";

import { useEffect } from "react";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/configs/siteConfig";
import { useMedia } from "@/hooks/use-media";
export const FarmerSidebar = () => {
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
      <div className="flex flex-col gap-y-2"></div>
    </div>
  );
};
