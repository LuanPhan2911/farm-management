import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldCreateForm } from "../_components/field-create-button";
import { getTranslations } from "next-intl/server";

const FieldCreatePage = async () => {
  const t = await getTranslations("fields.form");
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("create.title")}</CardTitle>
          <CardDescription>{t("create.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldCreateForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldCreatePage;
