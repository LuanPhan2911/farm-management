import { NotFoundPage } from "@/components/not-found-page";
import { getTranslations } from "next-intl/server";

const OrgNotFoundPage = async () => {
  const t = await getTranslations("organizations.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="organizations"
    />
  );
};

export default OrgNotFoundPage;
