"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "@/navigation";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";
import {
  Columns2,
  Compass,
  Flower,
  Globe,
  LayoutGrid,
  MountainSnow,
  Package,
  Section,
  Settings,
  Store,
  TicketCheck,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { SidebarAccordionItem } from "./sidebar-accordion-item";
import { useMedia } from "@/hooks/use-media";
import { forwardRef, useEffect } from "react";

interface SidebarProps {}
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({}, ref) => {
  const { isOpen, onClose, onOpen } = useDashboardSidebar();
  const { isMobile } = useMedia();
  const pathname = usePathname();

  useEffect(() => {
    if (isMobile) {
      onClose();
    } else {
      onOpen();
    }
  }, [isMobile, onClose, onOpen]);
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen, isMobile]);

  return (
    <div
      className={cn(
        "space-y-6 w-72 h-full px-2 py-6 fixed sm:top-0 top-16 left-0 transition-all z-50 bg-white overflow-y-auto",
        !isOpen && "hidden",
        "custom-scrollbar"
      )}
      ref={ref}
    >
      <Link href={"#"} className="mb-6 w-full h-12 relative block">
        <Image src={"/logo.png"} alt="Logo" fill />
      </Link>
      <div className="flex flex-col gap-y-2">
        <SidebarItem
          href="/dashboard"
          active={pathname === "/dashboard"}
          icon={LayoutGrid}
          title="Dashboard"
        />
        <SidebarAccordionItem title="Catalogue" icon={Flower}>
          <SidebarItem
            href="/dashboard/products"
            active={pathname === "/dashboard/products"}
            icon={Package}
            title="Products"
          />
          <SidebarItem
            href="/dashboard/categories"
            active={pathname === "/dashboard/categories"}
            icon={Section}
            title="Categories"
          />
          <SidebarItem
            href="/dashboard/attributes"
            active={pathname === "/dashboard/attributes"}
            icon={MountainSnow}
            title="Attributes"
          />
          <SidebarItem
            href="/dashboard/coupons"
            active={pathname === "/dashboard/coupons"}
            icon={TicketCheck}
            title="Coupons"
          />
        </SidebarAccordionItem>
        <SidebarItem
          href="/dashboard/customers"
          active={pathname === "/dashboard/customers"}
          icon={Users}
          title="Customers"
        />
        <SidebarItem
          href="/dashboard/orders"
          active={pathname === "/dashboard/orders"}
          icon={Compass}
          title="Orders"
        />
        <SidebarItem
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
        </SidebarAccordionItem>
      </div>
    </div>
  );
});
Sidebar.displayName = "Sidebar";
