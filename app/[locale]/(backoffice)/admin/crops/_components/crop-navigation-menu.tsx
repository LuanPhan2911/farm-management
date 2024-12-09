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
  const { isAdmin } = useCurrentStaffRole();
  const t = useTranslations("crops.tabs");
  const params = useParams<{
    cropId: string;
    activityId: string;
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
      ...(params.activityId && {
        subData: [
          {
            href: `${getHref}/activities/detail/${params.activityId}`,
            label: t("activities.info.label"),
          },
          {
            href: `${getHref}/activities/detail/${params.activityId}/staffs`,
            label: t("activities.staffs.label"),
          },
          {
            href: `${getHref}/activities/detail/${params.activityId}/equipment-usages`,
            label: t("activities.equipment-usages.label"),
          },
          {
            href: `${getHref}/activities/detail/${params.activityId}/material-usages`,
            label: t("activities.material-usages.label"),
          },
          {
            href: `${getHref}/activities/detail/${params.activityId}/danger`,
            label: t("activities.danger.label"),
          },
        ],
      }),
    },
    {
      href: `${getHref}/harvests`,
      label: t("harvests.label"),
    },
    {
      href: `${getHref}/sales`,
      label: t("sales.label"),
    },
    {
      href: `${getHref}/store`,
      label: t("store.label"),
    },
    {
      href: `${getHref}/danger`,
      label: t("danger.label"),
      disabled: isAdmin,
    },
  ];
  return <CustomNavigationMenu data={menu} />;
};
