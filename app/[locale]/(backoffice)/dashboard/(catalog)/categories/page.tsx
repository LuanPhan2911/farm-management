import { Heading } from "../../_components/heading";
import { CreateCategoryButton } from "./_components/create-category-button";
import { CategoriesTable } from "./_components/categories-table";
import { getTranslations } from "next-intl/server";
import { getAll } from "@/services/categories";
import { CategoriesExportButton } from "./_components/categories-export-button";
import { CategoriesImportButton } from "./_components/categories-import-button";

const CategoriesPage = async () => {
  const t = await getTranslations("categories");
  const data = await getAll();
  return (
    <div className="flex flex-col gap-y-4 h-full">
      <Heading title={t("heading")} />
      <div className="flex gap-x-4 justify-between">
        <div className="flex gap-x-2">
          <CategoriesExportButton />
          <CategoriesImportButton />
        </div>
        <div className="flex gap-x-2">
          <CreateCategoryButton />
        </div>
      </div>
      <CategoriesTable data={data} />
    </div>
  );
};

export default CategoriesPage;
