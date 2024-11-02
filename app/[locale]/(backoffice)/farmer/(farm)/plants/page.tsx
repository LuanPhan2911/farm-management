import { getPlants } from "@/services/plants";

import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlantsDataTable } from "../../../admin/(farm)/plants/_components/plants-data-table";

export async function generateMetadata() {
  const t = await getTranslations("plants.page");
  return {
    title: t("title"),
  };
}

const PlantsPage = async () => {
  const plants = await getPlants();
  const t = await getTranslations("plants.page");
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <PlantsDataTable data={plants} />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantsPage;
