import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

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

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default CropDetailPage;
