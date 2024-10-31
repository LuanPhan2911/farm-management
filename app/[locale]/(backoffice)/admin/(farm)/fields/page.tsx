import { getFields } from "@/services/fields";
import { FieldsDataTable } from "./_components/fields-data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldCreateButton } from "./_components/field-create-button";
import { getTranslations } from "next-intl/server";
import { auth } from "@clerk/nextjs/server";
import { OrgSwitcherButton } from "@/components/buttons/org-switcher-button";

export async function generateMetadata() {
  const t = await getTranslations("fields.page");
  return {
    title: t("title"),
  };
}
interface FieldPageProps {
  searchParams: {
    orgId?: string;
  };
}

const FieldPage = async ({ searchParams }: FieldPageProps) => {
  const t = await getTranslations("fields.page");
  const fields = await getFields({
    orgId: searchParams.orgId || null,
  });
  const { has } = auth();

  const canManageField = has({ permission: "org:field:manage" });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            {t("title")}
            <OrgSwitcherButton />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <FieldCreateButton disabled={!canManageField} />
          </div>
          <FieldsDataTable data={fields} />
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldPage;
