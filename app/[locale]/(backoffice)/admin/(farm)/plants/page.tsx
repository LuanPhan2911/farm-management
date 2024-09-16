import { getPlants } from "@/services/plants";
import { PlantsDataTable } from "./_components/plants-data-table";

const PlantsPage = async () => {
  const plants = await getPlants();
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <PlantsDataTable data={plants} />
    </div>
  );
};

export default PlantsPage;
