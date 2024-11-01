import { NotFoundPage } from "@/components/not-found-page";
import { getTranslations } from "next-intl/server";
interface OrgMessageFilesNotFoundPageProps {
  params: {
    orgId: string;
  };
}
const OrgMessageFilesNotFoundPage = async ({
  params,
}: OrgMessageFilesNotFoundPageProps) => {
  const t = await getTranslations("files.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl={`organizations/detail/${params.orgId}`}
    />
  );
};
export default OrgMessageFilesNotFoundPage;
