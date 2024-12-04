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
import { getCurrentStaff } from "@/services/staffs";

interface ActivityDangerPageProps {
  params: {
    cropId: string;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("crops.page.detail.store");
  return {
    title: t("title"),
  };
}

const ActivityDangerPage = async ({ params }: ActivityDangerPageProps) => {
  const t = await getTranslations("crops.page.detail.store");
  const store = await getStoreByCropId(params.cropId);
  const crop = await getCropById(params.cropId);
  const currentStaff = await getCurrentStaff();
  if (!crop || !currentStaff) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <StoreUpsertForm
            data={store}
            crop={crop}
            currentStaff={currentStaff}
          />
        </CardContent>
      </Card>
    </div>
  );
};
export default ActivityDangerPage;
