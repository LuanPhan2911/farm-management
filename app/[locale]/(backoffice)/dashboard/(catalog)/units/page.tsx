import { Heading } from "../../_components/heading";
import { UnitCreateButton } from "./_components/unit-create-button";
import { UnitsTable } from "./_components/units-data-table";
import { getTranslations } from "next-intl/server";
import { gitUnitsTable } from "@/services/units";

const UnitsPage = async () => {
  const t = await getTranslations("units");
  const data = await gitUnitsTable();
  return (
    <div className="flex flex-col gap-y-4 h-full">
      <Heading title={t("heading")} />
      <div className="ml-auto">
        <UnitCreateButton />
      </div>
      <UnitsTable data={data} />
    </div>
  );
};

export default UnitsPage;
