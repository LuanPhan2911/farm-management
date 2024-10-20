import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getEquipmentById, getEquipmentsSelect } from "@/services/equipments";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/equipment";

interface EquipmentDangerPageProps {
  params: {
    equipmentId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("equipments.page.detail.danger");
  return {
    title: t("title"),
  };
}

export async function generateStaticParams() {
  const equipments = await getEquipmentsSelect();
  return equipments.map((item) => {
    return {
      equipmentId: item.id,
    };
  });
}
const EquipmentDangerPage = async ({ params }: EquipmentDangerPageProps) => {
  const t = await getTranslations("equipments.form");
  const data = await getEquipmentById(params.equipmentId);
  if (!data) {
    notFound();
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("destroy.title")}</CardTitle>
        <CardDescription>{t("destroy.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <DestroyButton destroyFn={destroy} id={data.id} inltKey="equipments" />
      </CardContent>
    </Card>
  );
};
export default EquipmentDangerPage;
