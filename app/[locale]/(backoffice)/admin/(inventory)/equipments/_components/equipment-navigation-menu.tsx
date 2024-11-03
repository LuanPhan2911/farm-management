"use client";
import {
  CustomNavigationMenu,
  NavigationMenuData,
} from "@/components/custom-navigation-menu";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { usePrefix } from "@/hooks/use-prefix";
import { useTranslations } from "next-intl";

import { useParams } from "next/navigation";

export const EquipmentNavigationMenu = () => {
  const params = useParams<{
    equipmentId: string;
    equipmentDetailId: string;
  }>();

  const { isFarmer } = useCurrentStaffRole();
  const t = useTranslations("equipments.tabs");
  const prefix = usePrefix();
  if (!prefix) {
    return null;
  }
  const getHref = `${prefix}/equipments/detail/${params?.equipmentId}`;
  const data: NavigationMenuData[] = [
    {
      href: `${getHref}`,
      label: t("info.label"),
    },
    {
      href: `${getHref}/details`,
      label: t("details.label"),
      ...(params?.equipmentDetailId && {
        subData: [
          {
            label: t("details.usages.label"),
            href: `${getHref}/details/${params.equipmentDetailId}/usages`,
          },
        ],
      }),
    },
    {
      href: `${getHref}/danger`,
      label: t("danger.label"),
      disabled: isFarmer,
    },
  ];
  return <CustomNavigationMenu data={data} />;
};
