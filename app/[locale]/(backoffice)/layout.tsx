"use client";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";
import { cn } from "@/lib/utils";
import { useRef } from "react";

interface BackOfficeLayoutProps {
  children: React.ReactNode;
}

const BackOfficeLayout = ({ children }: BackOfficeLayoutProps) => {
  const { isOpen } = useDashboardSidebar();

  return (
    <div className="flex h-full w-full">
      <div
        className={cn(
          "h-full transition-all w-full relative",
          isOpen && "pl-0 sm:pl-60"
        )}
      >
        {/* Navbar */}
        <Navbar />
        {/* Sidebar */}
        <Sidebar />
        <main className="min-h-full h-fit w-full py-16 sm:px-6 px-2 ">
          {children}
        </main>
      </div>
      {/* Main body */}
    </div>
  );
};

export default BackOfficeLayout;
