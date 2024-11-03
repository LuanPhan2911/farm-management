import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EquipmentCreateForm } from "../_components/equipment-create-button";
export async function generateMetadata() {
  const t = await getTranslations("equipments.page.create");
  return {
    title: t("title"),
  };
}

const EquipmentCreatePage = async () => {
  const t = await getTranslations("equipments.page.create");

  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <EquipmentCreateForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentCreatePage;
