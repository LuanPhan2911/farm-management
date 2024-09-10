import { getPlantById } from "@/services/plants";
import { notFound } from "next/navigation";
import { PlantInfo } from "../../../_components/plant-info";

interface PlantDetailPageProps {
  params: {
    plantId: string;
  };
}
const PlantDetailPage = async ({ params }: PlantDetailPageProps) => {
  const plant = await getPlantById(params.plantId);
  if (!plant) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <PlantInfo data={plant} />
    </div>
  );
};

export default PlantDetailPage;
