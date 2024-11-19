import { useMedia } from "@/hooks/use-media";
import { cn } from "@/lib/utils";
import { Link } from "@/navigation";
import { useDashboardSidebar } from "@/stores/use-dashboard-sidebar";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  active: boolean;
  title: string;
  href: string;
}
export const SidebarItem = ({
  active,
  href,
  icon: Icon,
  title,
}: SidebarItemProps) => {
  const { isMobile } = useMedia();
  const { onClose } = useDashboardSidebar();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobile) {
      onClose();
    }
  };
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center p-2 gap-x-2 font-semibold text-md",
        active && "border-l-green-500 border border-l-4 text-green-500",
        "hover:border-l-green-400 hover:border hover:border-l-4 hover:text-green-400"
      )}
      onClick={handleClick}
    >
      <Icon className="h-4 w-4" />
      <span>{title}</span>
    </Link>
  );
};
