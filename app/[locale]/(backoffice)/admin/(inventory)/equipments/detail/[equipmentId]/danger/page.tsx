import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getEquipmentById } from "@/services/equipments";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/equipment";
import { getCurrentStaff } from "@/services/staffs";
import { isSuperAdmin } from "@/lib/permission";

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

const EquipmentDangerPage = async ({ params }: EquipmentDangerPageProps) => {
  const t = await getTranslations("equipments.form");
  const currentStaff = await getCurrentStaff();
  const data = await getEquipmentById(params.equipmentId);
  if (!data || !currentStaff) {
    notFound();
  }
  const canDelete =
    !data._count.equipmentDetails && isSuperAdmin(currentStaff.role);
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("destroy.title")}</CardTitle>
        <CardDescription>{t("destroy.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <DestroyButton
          destroyFn={destroy}
          id={data.id}
          inltKey="equipments"
          disabled={!canDelete}
        />
      </CardContent>
    </Card>
  );
};
export default EquipmentDangerPage;
