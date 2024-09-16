"use client";

import {
  SortByDropdown,
  SortByOption,
} from "@/components/form/sort-by-dropdown";
import { useTranslations } from "next-intl";

export const OrgMemberTableSortBy = () => {
  const t = useTranslations("organizations.search.member.sortByDropdown");
  const sortByOptions: SortByOption[] = [
    {
      label: t("options.email"),
      value: "email_address",
    },
    {
      label: t("options.firstName"),
      value: "first_name",
    },
    {
      label: t("options.lastName"),
      value: "last_name",
    },
    {
      label: t("options.createdAt"),
      value: "created_at",
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
