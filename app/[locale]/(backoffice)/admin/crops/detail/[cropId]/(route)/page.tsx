import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCropById } from "@/services/crops";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import {
  CropEditForm,
  CropEditLearnedLesson,
} from "../../../_components/crop-edit-button";

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
  const t = await getTranslations("crops.form");

  const data = await getCropById(params.cropId);
  if (!data) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("edit.title")}</CardTitle>
          <CardDescription>{t("edit.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <CropEditForm data={data} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t("editLearnedLessons.title")}</CardTitle>
          <CardDescription>
            {t("editLearnedLessons.description")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CropEditLearnedLesson data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CropDetailPage;
