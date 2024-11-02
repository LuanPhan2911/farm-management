"use client";
import {
  CustomNavigationMenu,
  NavigationMenuData,
} from "@/components/custom-navigation-menu";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { usePrefix } from "@/hooks/use-prefix";
import { FieldTable } from "@/types";
import { useTranslations } from "next-intl";

import { useParams } from "next/navigation";

interface FieldNavigationMenuProps {
  data?: FieldTable | null;
}
export const FieldNavigationMenu = ({ data }: FieldNavigationMenuProps) => {
  const params = useParams<{
    fieldId: string;
  }>()!;
  const prefix = usePrefix();
  const t = useTranslations("fields.tabs");
  if (!prefix) {
    return null;
  }

  const getHref = `${prefix}/fields/detail/${params.fieldId}`;
  const disabled = (data && data.orgId === null) || false;

  const navigationMenu: NavigationMenuData[] = [
    {
      href: `${getHref}`,
      label: t("info.label"),
    },
    {
      href: `${getHref}/crops`,
      label: t("crops.label"),
      disabled,
    },
    {
      href: `${getHref}/weathers`,
      label: t("weathers.label"),
      disabled,
    },
    {
      href: `${getHref}/soils`,
      label: t("soils.label"),
      disabled,
    },
    {
      href: `${getHref}/danger`,
      label: t("danger.label"),
    },
  ];
  return <CustomNavigationMenu data={navigationMenu} />;
};
