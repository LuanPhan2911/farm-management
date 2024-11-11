"use client";

import { NotFoundPage } from "@/components/not-found-page";

import { useTranslations } from "next-intl";

const JobEditNotFoundPage = () => {
  const t = useTranslations("jobs.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="jobs"
    />
  );
};

export default JobEditNotFoundPage;
