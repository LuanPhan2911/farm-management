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
  const t = await getTranslations("plants.form");
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
        <CardDescription>{t("destroy.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <DestroyButton
          destroyFn={destroy}
          id={data.id}
          inltKey="plants"
          disabled={!canDelete}
          redirectHref="plants"
        />
      </CardContent>
    </Card>
  );
};

export default PlantDetailDangerPage;
