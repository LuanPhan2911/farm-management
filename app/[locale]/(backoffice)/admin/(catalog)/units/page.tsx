import { UnitsTable } from "./_components/units-data-table";
import { getUnitsTable } from "@/services/units";

const UnitsPage = async () => {
  const data = await getUnitsTable();
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <UnitsTable data={data} />
    </div>
  );
};

export default UnitsPage;
