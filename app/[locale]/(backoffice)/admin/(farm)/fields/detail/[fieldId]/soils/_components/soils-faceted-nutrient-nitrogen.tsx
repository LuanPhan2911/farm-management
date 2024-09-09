"use client";

import { FacetedFilterNumberButton } from "@/components/buttons/faceted-filter-number-button";
import { useTranslations } from "next-intl";

export const SoilsFacetedNutrientNitrogen = () => {
  const t = useTranslations("soils.search.faceted");

  const options = [
    {
      label: "<=2",
      value: "<=2",
    },
    {
      label: ">=5",
      value: ">=5",
    },
  ];
  return (
    <FacetedFilterNumberButton
      options={options}
      column="nutrientNitrogen"
      title={t("nutrientNitrogen.placeholder")}
    />
  );
};
