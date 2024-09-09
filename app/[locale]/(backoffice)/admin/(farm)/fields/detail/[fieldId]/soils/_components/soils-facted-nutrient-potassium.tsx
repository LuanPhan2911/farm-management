"use client";

import { FacetedFilterNumberButton } from "@/components/buttons/faceted-filter-number-button";
import { useTranslations } from "next-intl";

export const SoilsFacetedNutrientPotassium = () => {
  const t = useTranslations("soils.search.faceted");

  const options = [
    {
      label: "<=1",
      value: "<=1",
    },
    {
      label: ">=4",
      value: ">=4",
    },
  ];
  return (
    <FacetedFilterNumberButton
      options={options}
      column="nutrientPotassium"
      title={t("nutrientPotassium.placeholder")}
    />
  );
};
