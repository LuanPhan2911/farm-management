import { CategoryCreateButton } from "./_components/category-create-button";
import { CategoriesTable } from "./_components/categories-data-table";

import { getCategoriesTable } from "@/services/categories";

const CategoriesPage = async () => {
  const data = await getCategoriesTable();
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <div className="ml-auto">
        <CategoryCreateButton />
      </div>
      <CategoriesTable data={data} />
    </div>
  );
};

export default CategoriesPage;
