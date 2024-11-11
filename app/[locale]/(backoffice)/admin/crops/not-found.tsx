import { NotFoundPage } from "@/components/not-found-page";
import { getTranslations } from "next-intl/server";

const CropNotFoundPage = async () => {
  const t = await getTranslations("crops.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="crops"
    />
  );
};

export default CropNotFoundPage;
