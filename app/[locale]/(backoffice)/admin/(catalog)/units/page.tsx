import { UnitsTable } from "./_components/units-data-table";
import { getUnitsTable } from "@/services/units";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { UnitCreateButton } from "./_components/unit-create-button";

export async function generateMetadata() {
  const t = await getTranslations("units.page");
  return {
    title: t("title"),
  };
}
const UnitsPage = async () => {
  const data = await getUnitsTable();
  const t = await getTranslations("units.page");
  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <UnitCreateButton />
          </div>
          <UnitsTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitsPage;
