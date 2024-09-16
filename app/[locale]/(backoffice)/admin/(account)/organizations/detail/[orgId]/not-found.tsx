"use client";
import { NotFoundPage } from "@/components/not-found-page";
import { useTranslations } from "next-intl";

const OrgNotFoundPage = () => {
  const t = useTranslations("organizations.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="/admin/organizations"
    />
  );
};

export default OrgNotFoundPage;
