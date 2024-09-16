"use client";

import { NotFoundPage } from "@/components/not-found-page";
import { useTranslations } from "next-intl";

const EquipmentNotFoundPage = () => {
  const t = useTranslations("equipments.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="/admin/equipments"
    />
  );
};

export default EquipmentNotFoundPage;
