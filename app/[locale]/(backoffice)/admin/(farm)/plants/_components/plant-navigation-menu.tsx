"use client";

import {
  CustomNavigationMenu,
  NavigationMenuData,
} from "@/components/custom-navigation-menu";
import { usePrefix } from "@/hooks/use-prefix";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export const PlantNavigationMenu = () => {
  const params = useParams<{
    plantId: string;
  }>();
  const t = useTranslations("plants.tabs");
  const prefix = usePrefix();
  if (!prefix) {
    return null;
  }

  const getHref = `${prefix}/plants/detail/${params!.plantId}`;
  const menuData: NavigationMenuData[] = [
    {
      href: `${getHref}`,
      label: t("info.label"),
    },
    {
      href: `${getHref}/fertilizers`,
      label: t("fertilizers.label"),
    },
    {
      href: `${getHref}/pesticides`,
      label: t("pesticides.label"),
    },
    {
      href: `${getHref}/danger`,
      label: t("danger.label"),
    },
  ];
  return <CustomNavigationMenu data={menuData} />;
};
