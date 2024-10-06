import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseToNumber } from "@/lib/utils";
import { getFilesDeletedByOwnerId } from "@/services/files";
import { getCurrentStaff } from "@/services/staffs";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { FilesDeletedTable } from "../_components/files-deleted-table";

export async function generateMetadata() {
  const t = await getTranslations("files.page.my-trash");
  return {
    title: t("title"),
  };
}
interface MyTrashPageProps {
  searchParams: {
    page?: string;
    query?: string;
    orderBy?: string;
  };
}
const MyTrashPage = async ({ searchParams }: MyTrashPageProps) => {
  const t = await getTranslations("files.page.my-trash");
  const page = parseToNumber(searchParams.page, 1);
  const { query, orderBy } = searchParams;
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  const { data, totalPage } = await getFilesDeletedByOwnerId({
    ownerId: currentStaff.id,
    orderBy,
    page,
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
          <FilesDeletedTable
            data={data}
            totalPage={totalPage}
            currentStaff={currentStaff}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MyTrashPage;
