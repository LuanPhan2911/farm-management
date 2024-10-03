import { getPlantById, getPlantsSelect } from "@/services/plants";
import { notFound } from "next/navigation";
import { PlantInfo } from "../../../_components/plant-info";
import { getTranslations } from "next-intl/server";

interface PlantDetailPageProps {
  params: {
    plantId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("plants.page.detail");
  return {
    title: t("title"),
  };
}
export async function generateStaticParams() {
  const plants = await getPlantsSelect();
  return plants.map((item) => {
    return {
      plantId: item.id,
    };
  });
}

const PlantDetailPage = async ({ params }: PlantDetailPageProps) => {
  const plant = await getPlantById(params!.plantId);

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
