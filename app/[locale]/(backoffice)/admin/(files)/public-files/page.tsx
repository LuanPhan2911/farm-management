import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseToNumber } from "@/lib/utils";
import { getPublicFiles } from "@/services/files";
import { getTranslations } from "next-intl/server";
import { FileCreateButton } from "../_components/file-create-button";
import { FilesTable } from "../_components/files-table";

export async function generateMetadata() {
  const t = await getTranslations("files.page.public-files");
  return {
    title: t("title"),
  };
}
interface PublicFilesPageProps {
  searchParams: {
    page?: string;
    query?: string;
    orderBy?: string;
  };
}
const PublicFilesPage = async ({ searchParams }: PublicFilesPageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const { query, orderBy } = searchParams;
  const t = await getTranslations("files.page.public-files");

  const { data, totalPage } = await getPublicFiles({
    page,
    orderBy,
    query,
  });
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <FileCreateButton
              input={{
                isPublic: true,
              }}
            />
          </div>
          <FilesTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicFilesPage;
