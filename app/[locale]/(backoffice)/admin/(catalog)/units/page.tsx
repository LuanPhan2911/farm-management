import { UnitCreateButton } from "./_components/unit-create-button";
import { UnitsTable } from "./_components/units-data-table";
import { getUnitsTable } from "@/services/units";

const UnitsPage = async () => {
  const data = await getUnitsTable();
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <div className="ml-auto">
        <UnitCreateButton />
      </div>
      <UnitsTable data={data} />
    </div>
  );
};

export default UnitsPage;
