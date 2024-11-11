"use client";
import {
  CustomNavigationMenu,
  NavigationMenuData,
} from "@/components/custom-navigation-menu";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { usePrefix } from "@/hooks/use-prefix";
import { useTranslations } from "next-intl";

import { useParams } from "next/navigation";

export const MaterialNavigationMenu = () => {
  const params = useParams<{
    materialId: string;
  }>();
  const prefix = usePrefix();
  const { isFarmer } = useCurrentStaffRole();
  const t = useTranslations("materials.tabs");
  if (!prefix) {
    return null;
  }
  const getHref = `${prefix}/materials/detail/${params?.materialId}`;
  const menu: NavigationMenuData[] = [
    {
      href: `${getHref}`,
      label: t("info.label"),
    },
    {
      href: `${getHref}/usages`,
      label: t("usages.label"),
    },
    {
      href: `${getHref}/danger`,
      label: t("danger.label"),
      disabled: isFarmer,
    },
  ];
  return <CustomNavigationMenu data={menu} />;
};
