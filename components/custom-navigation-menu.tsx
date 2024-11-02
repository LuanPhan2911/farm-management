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
import { Button } from "./ui/button";

export type NavigationMenuItem = {
  href: string;
  label: string;
  disabled?: boolean;
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
        {data.map(({ href, label, subData, disabled }) => {
          return (
            <NavigationMenuItem key={href}>
              {!subData?.length ? (
                <NavigationLink
                  href={href}
                  label={label}
                  isActive={href === pathname}
                  disabled={disabled}
                />
              ) : (
                <>
                  <NavigationMenuTrigger> {label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {subData.map(({ href, label, disabled }) => {
                      return (
                        <NavigationLink
                          href={href}
                          label={label}
                          isActive={href === pathname}
                          key={href}
                          disabled={disabled}
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
  disabled?: boolean;
}
const NavigationLink = ({
  href,
  isActive,
  label,
  disabled,
}: NavigationLinkProps) => {
  return (
    <Button
      size={"sm"}
      variant={"ghost"}
      disabled={disabled}
      className={cn(
        navigationMenuTriggerStyle(),
        isActive && "border-l-4 border-l-green-500 "
      )}
    >
      <Link href={href}>
        <span className={cn(isActive && "text-green-500 hover:text-green-400")}>
          {label}
        </span>
      </Link>
    </Button>
  );
};
