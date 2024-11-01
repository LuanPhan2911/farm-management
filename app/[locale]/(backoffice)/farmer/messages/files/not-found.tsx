import { NotFoundPage } from "@/components/not-found-page";
import { useTranslations } from "next-intl";

const MessageFilesNotFoundPage = () => {
  const t = useTranslations("files.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl="messages"
    />
  );
};
export default MessageFilesNotFoundPage;
