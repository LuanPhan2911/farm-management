import { getTranslations } from "next-intl/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ActivityCreateForm } from "../_components/activity-create-button";
import { getCurrentStaff } from "@/services/staffs";
import { notFound } from "next/navigation";
export async function generateMetadata() {
  const t = await getTranslations("activities.page.create");
  return {
    title: t("title"),
  };
}

const ActivityCreatePage = async () => {
  const t = await getTranslations("activities.form.create");
  const currentStaff = await getCurrentStaff();
  if (!currentStaff) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityCreateForm currentStaff={currentStaff} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityCreatePage;
