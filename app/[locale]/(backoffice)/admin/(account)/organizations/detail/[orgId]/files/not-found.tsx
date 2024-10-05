import { NotFoundPage } from "@/components/not-found-page";
import { useTranslations } from "next-intl";
interface OrgMessageFilesNotFoundPageProps {
  params: {
    orgId: string;
  };
}
const OrgMessageFilesNotFoundPage = ({
  params,
}: OrgMessageFilesNotFoundPageProps) => {
  const t = useTranslations("files.notFound");
  return (
    <NotFoundPage
      title={t("title")}
      description={t("description")}
      backButtonLabel={t("backLabel")}
      backButtonUrl={`/admin/organizations/detail/${params.orgId}`}
    />
  );
};
export default OrgMessageFilesNotFoundPage;
