import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { FileCreateButton } from "../_components/file-create-button";
import { FilesTable } from "../_components/files-table";
import { getFilesByOwnerId } from "@/services/files";
import { parseToNumber } from "@/lib/utils";
export async function generateMetadata() {
  const t = await getTranslations("files.page.my-files");
  return {
    title: t("title"),
  };
}
interface MyFilesPageProps {
  searchParams: {
    page?: string;
    query?: string;
    orderBy?: string;
  };
}
const MyFilesPage = async ({ searchParams }: MyFilesPageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const { query, orderBy } = searchParams;
  const t = await getTranslations("files.page.my-files");

  const { data, totalPage } = await getFilesByOwnerId({
    page,
    orderBy,
    query,
  });
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <FileCreateButton />
          </div>
          <FilesTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MyFilesPage;
