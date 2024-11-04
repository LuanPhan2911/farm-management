"use client";
import {
  CustomNavigationMenu,
  NavigationMenuData,
} from "@/components/custom-navigation-menu";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { usePrefix } from "@/hooks/use-prefix";
import { useTranslations } from "next-intl";

import { useParams } from "next/navigation";

export const CropNavigationMenu = () => {
  const prefix = usePrefix();
  const { isAdmin, isFarmer } = useCurrentStaffRole();
  const t = useTranslations("crops.tabs");
  const params = useParams<{
    cropId: string;
  }>()!;
  if (!prefix) {
    return null;
  }
  const getHref = `${prefix}/crops/detail/${params.cropId}`;
  const menu: NavigationMenuData[] = [
    {
      href: `${getHref}`,
      label: t("info.label"),
    },
    {
      href: `${getHref}/activities`,
      label: t("activities.label"),
    },
    {
      href: `${getHref}/danger`,
      label: t("danger.label"),
      disabled: isAdmin || isFarmer,
    },
  ];
  return <CustomNavigationMenu data={menu} />;
};
