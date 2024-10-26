"use client";

import { NotFoundPage } from "@/components/not-found-page";
import { useTranslations } from "next-intl";

const MaterialNotFoundPage = () => {
  const t = useTranslations("materials.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="/admin/materials"
    />
  );
};

export default MaterialNotFoundPage;
