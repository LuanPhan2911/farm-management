"use client";
import {
  CustomNavigationMenu,
  NavigationMenuData,
} from "@/components/custom-navigation-menu";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { usePrefix } from "@/hooks/use-prefix";
import { useTranslations } from "next-intl";

import { useParams } from "next/navigation";

export const FieldNavigationMenu = () => {
  const params = useParams<{
    fieldId: string;
  }>()!;
  const prefix = usePrefix();
  const t = useTranslations("fields.tabs");
  if (!prefix) {
    return null;
  }

  const getHref = `${prefix}/fields/detail/${params.fieldId}`;
  const data: NavigationMenuData[] = [
    {
      href: `${getHref}`,
      label: t("info.label"),
    },
    {
      href: `${getHref}/crops`,
      label: t("crops.label"),
    },
    {
      href: `${getHref}/weathers`,
      label: t("weathers.label"),
    },
    {
      href: `${getHref}/soils`,
      label: t("soils.label"),
    },
    {
      href: `${getHref}/danger`,
      label: t("danger.label"),
    },
  ];
  return <CustomNavigationMenu data={data} />;
};
