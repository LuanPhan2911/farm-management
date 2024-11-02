import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DestroyButton } from "@/components/buttons/destroy-button";
import { destroy } from "@/actions/field";
import { getFieldById } from "@/services/fields";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getTranslations } from "next-intl/server";

interface FieldDangerPageProps {
  params: {
    fieldId: string;
  };
}
const FieldDangerPage = async ({ params }: FieldDangerPageProps) => {
  const data = await getFieldById(params.fieldId);
  const { has } = auth();
  const isAdminOrg = has({ role: "org:admin" });
  const t = await getTranslations("fields.form");
  if (!data) {
    notFound();
  }
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
          inltKey="fields"
          redirectHref="fields"
          disabled={!isAdminOrg}
        />
      </CardContent>
    </Card>
  );
};

export default FieldDangerPage;
