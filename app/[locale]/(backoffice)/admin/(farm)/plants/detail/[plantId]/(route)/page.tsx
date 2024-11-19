import { getPlantById } from "@/services/plants";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlantEditForm } from "../../../_components/plant-edit-button";

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

const PlantDetailPage = async ({ params }: PlantDetailPageProps) => {
  const data = await getPlantById(params!.plantId);
  const t = await getTranslations("plants.tabs");
  if (!data) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card className="grid grid-cols-1 lg:grid-cols-5 p-6">
        <CardHeader>
          <CardTitle>{t("info.title")}</CardTitle>
          <CardDescription>{t("info.description")}</CardDescription>
          <h3 className="text-lg font-semibold">{data.name}</h3>
        </CardHeader>
        <CardContent className="lg:col-span-4">
          <PlantEditForm data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantDetailPage;
