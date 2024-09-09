"use client";

import { FacetedFilterNumberButton } from "@/components/buttons/faceted-filter-number-button";
import { useTranslations } from "next-intl";

export const SoilsFacetedNutrientPhosphorus = () => {
  const t = useTranslations("soils.search.faceted");

  const options = [
    {
      label: "<=0.5",
      value: "<=0,5",
    },
    {
      label: ">=2",
      value: ">=2",
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
