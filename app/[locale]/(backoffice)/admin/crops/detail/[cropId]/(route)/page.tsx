import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getActivityById } from "@/services/activities";
import { getCropById } from "@/services/crops";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { CropEditForm } from "../../../_components/crop-edit-button";

export async function generateMetadata() {
  const t = await getTranslations("crops.page.detail");
  return {
    title: t("title"),
  };
}

interface CropDetailPageProps {
  params: {
    cropId: string;
  };
}
const CropDetailPage = async ({ params }: CropDetailPageProps) => {
  const t = await getTranslations("crops.form.detail");

  const data = await getCropById(params.cropId);
  if (!data) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <CropEditForm data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CropDetailPage;
