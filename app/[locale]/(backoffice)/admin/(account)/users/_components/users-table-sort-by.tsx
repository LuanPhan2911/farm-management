import {
  SortByDropdown,
  SortByOption,
} from "@/components/form/sort-by-dropdown";
import { useTranslations } from "next-intl";

export const UsersTableSortBy = () => {
  const t = useTranslations("users.search.sortByDropdown");
  const sortByOptions: SortByOption[] = [
    {
      label: t("options.email"),
      value: "email_address",
    },
    {
      label: t("options.createdAt"),
      value: "created_at",
    },

    {
      label: t("options.lastSignInAt"),
      value: "last_sign_in_at",
    },
    {
      label: t("options.lastActiveAt"),
      value: "last_active_at",
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
