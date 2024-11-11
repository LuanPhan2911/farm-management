import { NotFoundPage } from "@/components/not-found-page";
import { useTranslations } from "next-intl";

const FieldNotFoundPage = () => {
  const t = useTranslations("fields.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="fields"
    />
  );
};

export default FieldNotFoundPage;
