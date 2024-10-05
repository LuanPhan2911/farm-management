import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getTranslations } from "next-intl/server";
import { getFiles } from "@/services/files";
import { parseToNumber } from "@/lib/utils";
import { getCurrentStaff } from "@/services/staffs";
import { notFound } from "next/navigation";
import { FilesTable } from "@/app/[locale]/(backoffice)/admin/(files)/_components/files-table";

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
  const page = parseToNumber(searchParams.page, 1);
  const { orgId } = params;
  const { data, totalPage } = await getFiles({
    orgId,
    page,
    query,
    orderBy,
  });
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FilesTable
            data={data}
            totalPage={totalPage}
            currentStaff={currentStaff}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrgMessageFilesPage;
