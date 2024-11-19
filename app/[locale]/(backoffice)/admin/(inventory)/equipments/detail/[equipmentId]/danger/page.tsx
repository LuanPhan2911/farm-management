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
import { CustomAlert } from "@/components/cards/custom-alert";
import { DestroyButtonWithConfirmCode } from "@/components/buttons/destroy-button-with-confirm-code";

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
  const t = await getTranslations("equipments.danger");
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
      </CardHeader>
      <CardContent>
        <CustomAlert
          variant={"info"}
          description={t("destroy.description.canDelete")}
        />
        <CustomAlert
          variant={"destructive"}
          description={t("destroy.description.deleteWhen")}
        />
        <DestroyButtonWithConfirmCode
          destroyFn={destroy}
          id={data.id}
          inltKey="equipments"
          disabled={!canDelete}
          confirmCode="DELETE_EQUIPMENT"
        />
      </CardContent>
    </Card>
  );
};
export default EquipmentDangerPage;
