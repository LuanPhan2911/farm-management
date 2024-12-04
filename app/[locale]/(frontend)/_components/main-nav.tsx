"use client";

import { Icons } from "@/components/icons";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { siteConfig } from "@/configs/siteConfig";
import { cn } from "@/lib/utils";

import Link from "next/link";

export const MainNav = () => {
  return (
    <div className="md:flex hidden mr-4">
      <Link href={"/"} className="mr-4 flex items-center space-x-2 lg:mr-6">
        <Icons.logo width={24} height={24} />
        <span className="hidden font-bold lg:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/products" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-inherit hover:bg-inherit hover:text-green-500"
                )}
              >
                Nông sản
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link href="/jobs" legacyBehavior passHref>
              <NavigationMenuLink
                className={cn(
                  navigationMenuTriggerStyle(),
                  "bg-inherit hover:bg-inherit hover:text-green-500"
                )}
              >
                Tuyển dụng
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
