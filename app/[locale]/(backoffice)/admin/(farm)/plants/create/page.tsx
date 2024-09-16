import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { PlantCreateForm } from "../_components/plant-create-button";

const PlantCreatePage = async () => {
  const t = await getTranslations("plants");
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("form.create.title")}</CardTitle>
          <CardDescription>{t("form.create.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <PlantCreateForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default PlantCreatePage;
