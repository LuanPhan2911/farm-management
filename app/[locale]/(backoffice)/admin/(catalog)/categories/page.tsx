import { CategoryCreateButton } from "./_components/category-create-button";
import { CategoriesTable } from "./_components/categories-data-table";
import { getTranslations } from "next-intl/server";
import { getCategoriesTable } from "@/services/categories";

const CategoriesPage = async () => {
  const t = await getTranslations("categories");
  const data = await getCategoriesTable();
  return (
    <div className="flex flex-col gap-y-4 h-full">
      <div className="ml-auto">
        <CategoryCreateButton />
      </div>
      <CategoriesTable data={data} />
    </div>
  );
};

export default CategoriesPage;
