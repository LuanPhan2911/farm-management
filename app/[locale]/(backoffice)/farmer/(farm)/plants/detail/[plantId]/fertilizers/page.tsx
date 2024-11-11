import { PlantFertilizersDataTable } from "@/app/[locale]/(backoffice)/admin/(farm)/plants/detail/[plantId]/fertilizers/_components/plant-fertilizers-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlantFertilizers } from "@/services/plant-fertilizers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("plantFertilizers.page");
  return {
    title: t("title"),
  };
}
interface PlantFertilizersPageProps {
  params: {
    plantId: string;
  };
}
const PlantFertilizersPage = async ({ params }: PlantFertilizersPageProps) => {
  const t = await getTranslations("plantFertilizers.page");
  const plantFertilizers = await getPlantFertilizers({
    plantId: params.plantId,
  });
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PlantFertilizersDataTable data={plantFertilizers} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantFertilizersPage;
