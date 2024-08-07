"use client";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { useMedia } from "@/hooks/use-media";

interface BackOfficeLayoutProps {
  children: React.ReactNode;
}

const BackOfficeLayout = ({ children }: BackOfficeLayoutProps) => {
  const { isOpen, onClose } = useDashboardSidebar();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMedia();

  useOnClickOutside(sidebarRef, () => {
    if (isMobile && isOpen) {
      onClose();
    }
  });

  return (
    <div className="flex h-full w-full">
      <div
        className={cn(
          "h-full transition-all w-full relative",
          isOpen && "pl-0 sm:pl-72"
        )}
      >
        {/* Navbar */}
        <Navbar />
        {/* Sidebar */}
        <Sidebar ref={sidebarRef} />
        <main className="min-h-full h-fit w-full py-16 sm:px-6 px-2 ">
          {children}
        </main>
      </div>
      {/* Main body */}
    </div>
  );
};

export default BackOfficeLayout;
