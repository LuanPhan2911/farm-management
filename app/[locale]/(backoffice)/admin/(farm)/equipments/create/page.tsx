import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EquipmentCreateForm } from "../_components/equipment-create-button";
const EquipmentCreatePage = async () => {
  const t = await getTranslations("equipments.form");
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("create.title")}</CardTitle>
          <CardDescription>{t("create.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <EquipmentCreateForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default EquipmentCreatePage;
