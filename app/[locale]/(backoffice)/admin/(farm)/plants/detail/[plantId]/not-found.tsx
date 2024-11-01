import { NotFoundPage } from "@/components/not-found-page";
import { useTranslations } from "next-intl";

const PlantDetailNotFound = () => {
  const t = useTranslations("plants.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="users"
    />
  );
};

export default PlantDetailNotFound;
