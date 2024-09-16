import { CategoriesTable } from "./_components/categories-data-table";

import { getCategoriesTable } from "@/services/categories";

const CategoriesPage = async () => {
  const data = await getCategoriesTable();
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <CategoriesTable data={data} />
    </div>
  );
};

export default CategoriesPage;
