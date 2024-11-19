import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getMaterialById } from "@/services/materials";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { destroy } from "@/actions/material";
import { getCurrentStaff } from "@/services/staffs";
import { isSuperAdmin } from "@/lib/permission";
import { CustomAlert } from "@/components/cards/custom-alert";
import { DestroyButtonWithConfirmCode } from "@/components/buttons/destroy-button-with-confirm-code";

interface MaterialDangerPageProps {
  params: {
    materialId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("materials.page.detail.danger");
  return {
    title: t("title"),
  };
}

const MaterialDangerPage = async ({ params }: MaterialDangerPageProps) => {
  const data = await getMaterialById(params!.materialId);
  const currentStaff = await getCurrentStaff();

  const t = await getTranslations("materials.danger");
  if (!data || !currentStaff) {
    notFound();
  }
  const canDelete =
    !data._count.materialUsages && isSuperAdmin(currentStaff.role);
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
          inltKey="materials"
          redirectHref="materials"
          disabled={!canDelete}
          confirmCode="DELETE_MATERIAL"
        />
      </CardContent>
    </Card>
  );
};
export default MaterialDangerPage;
