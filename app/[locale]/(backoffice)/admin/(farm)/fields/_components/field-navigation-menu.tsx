"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/navigation";

import { useParams } from "next/navigation";

export const FieldNavigationMenu = () => {
  const params = useParams<{
    fieldId: string;
  }>();
  const pathname = usePathname();
  const getHref = `/admin/fields/detail/${params.fieldId}`;
  const menu = [
    {
      href: `${getHref}`,
      label: "Info",
    },
    {
      href: `${getHref}/crops`,
      label: "Crops",
    },
    {
      href: `${getHref}/weathers`,
      label: "Weathers",
    },
    {
      href: `${getHref}/soils`,
      label: "Soils",
    },
    {
      href: `${getHref}/danger`,
      label: "Danger",
    },
  ];
  return (
    <NavigationMenu className="border rounded-md">
      <NavigationMenuList>
        {menu.map(({ href, label }) => {
          return (
            <NavigationMenuItem key={href}>
              <Link
                href={href}
                className={cn(
                  navigationMenuTriggerStyle(),
                  href === pathname && "border-l-4 border-l-green-500 "
                )}
              >
                <span
                  className={cn(
                    href === pathname && "text-green-500 hover:text-green-400"
                  )}
                >
                  {label}
                </span>
              </Link>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
