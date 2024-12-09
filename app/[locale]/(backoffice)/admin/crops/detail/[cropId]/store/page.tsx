import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { StoreUpsertForm } from "./_components/store-upsert-button";
import { getStoreByCropId } from "@/services/stores";
import { getCropById } from "@/services/crops";
import { notFound } from "next/navigation";
import { getCurrentStaff, getCurrentStaffRole } from "@/services/staffs";
import { canUpdateCropStatus } from "@/lib/permission";

interface StorePageProps {
  params: {
    cropId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("stores.page");
  return {
    title: t("title"),
  };
}

const StorePage = async ({ params }: StorePageProps) => {
  const t = await getTranslations("stores.page");
  const store = await getStoreByCropId(params.cropId);
  const crop = await getCropById(params.cropId);
  const currentStaff = await getCurrentStaff();
  if (!crop || !currentStaff) {
    notFound();
  }

  const { isOnlyAdmin } = await getCurrentStaffRole();

  const canEdit = isOnlyAdmin && canUpdateCropStatus(crop.status);
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <StoreUpsertForm
            data={store}
            crop={crop}
            currentStaff={currentStaff}
            canEdit={canEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default StorePage;
