"use client";

import { NotFoundPage } from "@/components/not-found-page";
import { useTranslations } from "next-intl";

const ActivityNotFoundPage = () => {
  const t = useTranslations("activities.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="activities"
    />
  );
};

export default ActivityNotFoundPage;
