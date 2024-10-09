import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilesTable } from "../../../(files)/_components/files-table";
import { getTranslations } from "next-intl/server";
import { getMessageFiles } from "@/services/files";
import { parseToNumber } from "@/lib/utils";
import { getCurrentStaff } from "@/services/staffs";
import { notFound } from "next/navigation";

export async function generateMetadata() {
  const t = await getTranslations("messages.page.files");
  return {
    title: t("title"),
  };
}
interface MessageFilesPageProps {
  searchParams: {
    page?: string;
    query?: string;
    orderBy?: string;
  };
}
const MessageFilesPage = async ({ searchParams }: MessageFilesPageProps) => {
  const t = await getTranslations("messages.page.files");
  const { query, orderBy } = searchParams;
  const page = parseToNumber(searchParams.page, 1);
  const { data, totalPage } = await getMessageFiles({
    isPublic: true,
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

export default MessageFilesPage;
