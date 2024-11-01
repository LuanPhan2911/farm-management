"use client";
import { NotFoundPage } from "@/components/not-found-page";
import { useTranslations } from "next-intl";

const UserDetailNotFound = () => {
  const t = useTranslations("users.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="users"
    />
  );
};

export default UserDetailNotFound;
