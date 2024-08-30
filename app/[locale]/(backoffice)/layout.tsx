"use client";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";
import { Navbar } from "./_components/navbar";
import { cn } from "@/lib/utils";

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

        {children}
      </div>
      {/* Main body */}
    </div>
  );
};

export default BackOfficeLayout;
