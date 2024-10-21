"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/navigation";
import { useTranslations } from "next-intl";

import { useParams } from "next/navigation";

export const ActivityNavigationMenu = () => {
  const params = useParams<{
    activityId: string;
  }>();
  const pathname = usePathname();
  const t = useTranslations("activities.tabs");
  const getHref = `/admin/activities/detail/${params?.activityId}`;
  const menu = [
    {
      href: `${getHref}`,
      label: t("info.label"),
    },
    {
      href: `${getHref}/equipment-usages`,
      label: t("equipment-usages.label"),
    },
    {
      href: `${getHref}/material-usages`,
      label: t("material-usages.label"),
    },
    {
      href: `${getHref}/danger`,
      label: t("danger.label"),
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
