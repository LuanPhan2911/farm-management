import { getFields } from "@/services/fields";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { FieldsDataTable } from "../../../admin/(farm)/fields/_components/fields-data-table";

export async function generateMetadata() {
  const t = await getTranslations("fields.page");
  return {
    title: t("title"),
  };
}
interface FieldPageProps {}

const FieldPage = async ({}: FieldPageProps) => {
  const t = await getTranslations("fields.page");
  const { orgId } = auth();
  const fields = await getFields({
    orgId: orgId || null,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldsDataTable data={fields} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldPage;
