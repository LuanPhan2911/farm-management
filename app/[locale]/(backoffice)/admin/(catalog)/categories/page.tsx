import { CategoriesTable } from "./_components/categories-data-table";

import { getCategoriesTable } from "@/services/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryCreateButton } from "./_components/category-create-button";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("categories.page");
  return {
    title: t("title"),
  };
}

const CategoriesPage = async () => {
  const data = await getCategoriesTable();
  const t = await getTranslations("categories.page");
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <CategoryCreateButton />
          </div>
          <CategoriesTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoriesPage;
