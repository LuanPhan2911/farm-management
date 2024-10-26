import { getMaterials } from "@/services/materials";
import { MaterialsTable } from "./_components/materials-table";
import { parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaterialCreateButton } from "./_components/material-create-button";
interface MaterialsPageProps {
  params: {};
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("materials.page");
  return {
    title: t("title"),
  };
}

const MaterialsPage = async ({ searchParams }: MaterialsPageProps) => {
  const page = parseToNumber(searchParams!.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
  const t = await getTranslations("materials.page");
  const { data, totalPage } = await getMaterials({
    filterNumber,
    filterString,
    orderBy,
    page,
  });
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <MaterialCreateButton />
          </div>
          <MaterialsTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialsPage;
