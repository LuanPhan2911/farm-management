import { getMaterials } from "@/services/materials";
import { parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MaterialsTable } from "../../../admin/(inventory)/materials/_components/materials-table";

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
          <MaterialsTable data={data} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialsPage;
