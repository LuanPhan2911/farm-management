import { getFields } from "@/services/fields";
import { FieldsDataTable } from "./_components/fields-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldCreateButton } from "./_components/field-create-button";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("fields.page");
  return {
    title: t("title"),
  };
}
const FieldPage = async () => {
  const fields = await getFields();
  const t = await getTranslations("fields.page");
  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <FieldCreateButton />
          </div>
          <FieldsDataTable data={fields} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldPage;
