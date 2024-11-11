"use client";
import {
  CustomNavigationMenu,
  NavigationMenuData,
} from "@/components/custom-navigation-menu";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { usePrefix } from "@/hooks/use-prefix";
import { useTranslations } from "next-intl";

import { useParams } from "next/navigation";

export const ActivityNavigationMenu = () => {
  const params = useParams<{
    activityId: string;
  }>();
  const prefix = usePrefix();
  const { isFarmer } = useCurrentStaffRole();
  const t = useTranslations("activities.tabs");
  if (!prefix) {
    return null;
  }
  const getHref = `${prefix}/activities/detail/${params?.activityId}`;
  const menu: NavigationMenuData[] = [
    {
      href: `${getHref}`,
      label: t("info.label"),
    },
    {
      href: `${getHref}/staffs`,
      label: t("staffs.label"),
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
      disabled: isFarmer,
    },
  ];
  return <CustomNavigationMenu data={menu} />;
};
