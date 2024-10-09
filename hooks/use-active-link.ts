import { usePathname } from "@/navigation";

export const useActiveLink = (href: string) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return isActive;
};
