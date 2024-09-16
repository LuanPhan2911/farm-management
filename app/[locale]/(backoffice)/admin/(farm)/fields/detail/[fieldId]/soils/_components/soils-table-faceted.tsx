"use client";

import { FacetedFilterNumberButton } from "@/components/buttons/faceted-filter-number-button";
import { useTranslations } from "next-intl";

const SoilsFacetedNutrientNitrogen = () => {
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
const SoilsFacetedNutrientPhosphorus = () => {
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

const SoilsFacetedNutrientPotassium = () => {
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
export const SoilsTableFaceted = () => {
  return (
    <div className="flex gap-2 my-2 lg:flex-row flex-col">
      <SoilsFacetedNutrientNitrogen />
      <SoilsFacetedNutrientPhosphorus />
      <SoilsFacetedNutrientPotassium />
    </div>
  );
};
