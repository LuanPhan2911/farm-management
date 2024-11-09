import { MaterialUsagesTable } from "@/app/[locale]/(backoffice)/admin/(inventory)/materials/detail/[materialId]/usages/_components/material-usages-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { parseToNumber } from "@/lib/utils";
import { getMaterialUsages } from "@/services/material-usages";
import { getMaterialsSelect } from "@/services/materials";
import { getTranslations } from "next-intl/server";

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

  const {
    data: materialUsages,
    totalPage,
    totalCost,
  } = await getMaterialUsages({
    materialId: params.materialId,
    page,
    query,
    orderBy,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <MaterialUsagesTable
          data={materialUsages}
          totalPage={totalPage}
          totalCost={totalCost}
        />
      </CardContent>
    </Card>
  );
};
export default MaterialUsagesPage;
