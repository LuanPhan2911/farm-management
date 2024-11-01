"use client";

import { NotFoundPage } from "@/components/not-found-page";
import { useTranslations } from "next-intl";

const StaffNotFoundPage = () => {
  const t = useTranslations("staffs.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="staffs"
    />
  );
};

export default StaffNotFoundPage;
