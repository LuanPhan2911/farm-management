"use client";

import { FacetedFilterNumberButton } from "@/components/buttons/faceted-filter-number-button";
import { useTranslations } from "next-intl";

export const SoilsFacetedNutrientPhosphorus = () => {
  const t = useTranslations("soils.search.faceted");

  const options = [
    {
      label: "<=1",
      value: "<=1",
    },
    {
      label: ">=3",
      value: ">=3",
    },
  ];
  return (
    <FacetedFilterNumberButton
      options={options}
      column="nutrientPhosphorus"
      title={t("nutrientPhosphorus.placeholder")}
    />
  );
};
