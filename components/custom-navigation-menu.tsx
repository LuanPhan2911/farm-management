"use client";

import { Link, usePathname } from "@/navigation";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/navigation-menu";
import { cn } from "@/lib/utils";

export type NavigationMenuItem = {
  href: string;
  label: string;
};
export type NavigationMenuData = NavigationMenuItem & {
  subData?: NavigationMenuItem[];
};

interface CustomNavigationMenuProps {
  data: NavigationMenuData[];
}
export const CustomNavigationMenu = ({ data }: CustomNavigationMenuProps) => {
  const pathname = usePathname();
  return (
    <NavigationMenu className="border rounded-md">
      <NavigationMenuList>
        {data.map(({ href, label, subData }) => {
          return (
            <NavigationMenuItem key={href}>
              {!subData?.length ? (
                <NavigationLink
                  href={href}
                  label={label}
                  isActive={href === pathname}
                />
              ) : (
                <>
                  <NavigationMenuTrigger> {label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {subData.map(({ href, label }) => {
                      return (
                        <NavigationLink
                          href={href}
                          label={label}
                          isActive={href === pathname}
                          key={href}
                        />
                      );
                    })}
                  </NavigationMenuContent>
                </>
              )}
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

interface NavigationLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}
const NavigationLink = ({ href, isActive, label }: NavigationLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        navigationMenuTriggerStyle(),
        isActive && "border-l-4 border-l-green-500 "
      )}
    >
      <span className={cn(isActive && "text-green-500 hover:text-green-400")}>
        {label}
      </span>
    </Link>
  );
};
