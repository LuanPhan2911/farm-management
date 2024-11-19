import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/plant";
import { getPlantById } from "@/services/plants";
import { notFound } from "next/navigation";
import { getCurrentStaff } from "@/services/staffs";
import { isSuperAdmin } from "@/lib/permission";
import { CustomAlert } from "@/components/cards/custom-alert";
import { DestroyButtonWithConfirmCode } from "@/components/buttons/destroy-button-with-confirm-code";
export async function generateMetadata() {
  const t = await getTranslations("plants.page.detail.danger");
  return {
    title: t("title"),
  };
}

interface PlantDetailDangerPageProps {
  params: {
    plantId: string;
  };
}
const PlantDetailDangerPage = async ({
  params,
}: PlantDetailDangerPageProps) => {
  const t = await getTranslations("plants.danger");
  const data = await getPlantById(params.plantId);
  const currentStaff = await getCurrentStaff();
  if (!data || !currentStaff) {
    notFound();
  }
  const canDelete = isSuperAdmin(currentStaff.role);
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
          inltKey="plants"
          disabled={!canDelete}
          redirectHref="plants"
          confirmCode="DELETE_PLANT"
        />
      </CardContent>
    </Card>
  );
};

export default PlantDetailDangerPage;
