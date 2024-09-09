"use client";

import {
  SortByDropdown,
  SortByOption,
} from "@/components/form/sort-by-dropdown";
import { useTranslations } from "next-intl";

export const OrgsTableSortBy = () => {
  const t = useTranslations("organizations.search.sortByDropdown");
  const sortByOptions: SortByOption[] = [
    {
      label: t("options.createdAt"),
      value: "created_at",
    },
    {
      label: t("options.name"),
      value: "name",
    },
    {
      label: t("options.membersCount"),
      value: "members_count",
    },
  ];
  return (
    <SortByDropdown
      options={sortByOptions}
      label={t("label")}
      placeholder={t("placeholder")}
    />
  );
};
