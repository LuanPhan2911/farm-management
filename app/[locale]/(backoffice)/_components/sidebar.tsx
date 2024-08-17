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
  Section,
  Settings,
  Store,
  User,
  Users,
} from "lucide-react";

import Link from "next/link";
import { SidebarItem } from "./sidebar-item";
import { SidebarAccordionItem } from "./sidebar-accordion-item";

import { forwardRef } from "react";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/configs/siteConfig";

interface SidebarProps {}
export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({}, ref) => {
  const { isOpen } = useDashboardSidebar();

  const pathname = usePathname();

  return (
    <div
      className={cn(
        "space-y-6 w-60 h-full px-2 py-6 fixed sm:top-0 top-16 left-0 transition-all z-50 overflow-y-auto",
        !isOpen && "hidden",
        "custom-scrollbar border-r rounded-md shadow-md bg-background"
      )}
      ref={ref}
    >
      <Link href={"/"} className="flex items-center">
        <Icons.logo className="mr-2 h-6 w-6" />
        <span className="font-bold">{siteConfig.name}</span>
      </Link>
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

        <SidebarAccordionItem title="Recruit" icon={Users}>
          <SidebarItem
            href="/dashboard/jobs"
            active={pathname === "/dashboard/jobs"}
            icon={Compass}
            title="Jobs"
          />
          <SidebarItem
            href="/dashboard/applicants"
            active={pathname === "/dashboard/applicants"}
            icon={User}
            title="Applicants"
          />
        </SidebarAccordionItem>
        <SidebarItem
          href="/dashboard/customers"
          active={pathname === "/dashboard/customers"}
          icon={Users}
          title="Customers"
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
