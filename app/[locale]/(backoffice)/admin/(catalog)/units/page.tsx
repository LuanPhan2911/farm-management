import { UnitCreateButton } from "./_components/unit-create-button";
import { UnitsTable } from "./_components/units-data-table";
import { gitUnitsTable } from "@/services/units";

const UnitsPage = async () => {
  const data = await gitUnitsTable();
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
