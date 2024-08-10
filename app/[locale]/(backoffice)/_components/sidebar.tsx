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
  Menu,
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
import { Button } from "@/components/ui/button";

interface SidebarProps {}
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({}, ref) => {
  const { isOpen, onClose, onOpen, onToggle } = useDashboardSidebar();
  const { isDesktop } = useMedia();
  const pathname = usePathname();

  useEffect(() => {
    if (isDesktop) {
      onOpen();
    } else {
      onClose();
    }
  }, [isDesktop, onClose, onOpen]);
  useEffect(() => {
    if (!isDesktop && isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen, isDesktop]);

  return (
    <div
      className={cn(
        "space-y-6 w-60 h-full px-2 py-6 fixed sm:top-0 top-16 left-0 transition-all z-50 overflow-y-auto",
        !isOpen && "hidden",
        "custom-scrollbar border-r rounded-md shadow-md dark:bg-black bg-white"
      )}
      ref={ref}
    >
      <div className="flex items-center mb-6">
        <Link href={"/dashboard"} className="h-12 w-36 relative block">
          <Image src={"/logo.png"} alt="Logo" fill />
        </Link>
      </div>
      <div className="flex flex-col gap-y-2">
        <SidebarItem
          href="/dashboard"
          active={pathname === "/dashboard"}
          icon={LayoutGrid}
          title="Dashboard"
        />
        <SidebarAccordionItem title="Catalogue" icon={Flower}>
          {/* <SidebarItem
            href="/dashboard/products"
            active={pathname === "/dashboard/products"}
            icon={Package}
            title="Products"
          /> */}
          <SidebarItem
            href="/dashboard/categories"
            active={pathname === "/dashboard/categories"}
            icon={Section}
            title="Categories"
          />
          <SidebarItem
            href="/dashboard/units"
            active={pathname === "/dashboard/units"}
            icon={MountainSnow}
            title="Units"
          />
          {/* <SidebarItem
            href="/dashboard/coupons"
            active={pathname === "/dashboard/coupons"}
            icon={TicketCheck}
            title="Coupons"
          /> */}
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
