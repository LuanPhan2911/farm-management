"use client";
import { NotFoundPage } from "@/components/not-found-page";
import { useTranslations } from "next-intl";

const MessagesNotFoundPage = () => {
  const t = useTranslations("messages.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="/admin/dashboard"
    />
  );
};

export default MessagesNotFoundPage;
