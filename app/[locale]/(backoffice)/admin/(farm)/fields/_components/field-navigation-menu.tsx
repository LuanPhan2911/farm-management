"use client";
import {
  CustomNavigationMenu,
  NavigationMenuData,
} from "@/components/custom-navigation-menu";
import { useTranslations } from "next-intl";

import { useParams } from "next/navigation";

export const FieldNavigationMenu = () => {
  const params = useParams<{
    fieldId: string;
  }>()!;

  const t = useTranslations("fields.tabs");
  const getHref = `/admin/fields/detail/${params.fieldId}`;
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
