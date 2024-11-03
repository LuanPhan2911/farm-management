import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { parseToNumber } from "@/lib/utils";
import { getMaterialUsages } from "@/services/material-usages";
import { getMaterialById, getMaterialsSelect } from "@/services/materials";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { MaterialUsageCreateButton } from "./_components/material-usages-create-button";
import { MaterialUsagesTable } from "./_components/material-usages-table";
export async function generateMetadata() {
  const t = await getTranslations("materials.page.detail.usages");
  return {
    title: t("title"),
  };
}

export async function generateStaticParams() {
  const materials = await getMaterialsSelect();
  return materials.map((item) => {
    return {
      materialId: item.id,
    };
  });
}
interface MaterialUsagesPageProps {
  params: {
    materialId: string;
  };
  searchParams: {
    page?: string;
    query?: string;
    orderBy?: string;
  };
}
const MaterialUsagesPage = async ({
  params,
  searchParams,
}: MaterialUsagesPageProps) => {
  const t = await getTranslations("materials.page.detail.usages");
  const { query, orderBy } = searchParams;
  const page = parseToNumber(searchParams!.page, 1);
  const material = await getMaterialById(params.materialId);

  const { data: materialUsages, totalPage } = await getMaterialUsages({
    materialId: params.materialId,
    page,
    query,
    orderBy,
  });
  if (!material) {
    notFound();
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <MaterialUsageCreateButton material={material} />
        </div>
        <MaterialUsagesTable data={materialUsages} totalPage={totalPage} />
      </CardContent>
    </Card>
  );
};
export default MaterialUsagesPage;
