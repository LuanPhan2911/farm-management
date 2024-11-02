import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { getMessageFiles } from "@/services/files";
import { parseToNumber } from "@/lib/utils";
import { FilesTable } from "@/app/[locale]/(backoffice)/admin/(files)/_components/files-table";
import { getOrganizationMembership } from "@/services/organizations";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const t = await getTranslations("messages.page.files");
  return {
    title: t("title"),
  };
}
interface OrgMessageFilesPageProps {
  params: {
    orgId: string;
  };
  searchParams: {
    page?: string;
    query?: string;
    orderBy?: string;
  };
}
const OrgMessageFilesPage = async ({
  searchParams,
  params,
}: OrgMessageFilesPageProps) => {
  const t = await getTranslations("messages.page.files");
  const { query, orderBy } = searchParams;
  const { orgId } = params;
  const page = parseToNumber(searchParams.page, 1);
  const orgMembers = await getOrganizationMembership({
    orgId,
  });
  if (!orgMembers.length) {
    notFound();
  }
  const { data, totalPage } = await getMessageFiles({
    orgId,
    page,
    query,
    orderBy,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FilesTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgMessageFilesPage;
