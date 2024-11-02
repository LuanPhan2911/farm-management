"use client";

import {
  FacetedFilterNumberButton,
  FilterNumberOption,
} from "@/components/buttons/faceted-filter-number-button";
import { useTranslations } from "next-intl";

const SoilsFacetedNutrientNitrogen = () => {
  const t = useTranslations("soils.search.faceted");

  const options: FilterNumberOption[] = [
    {
      label: "<=1",
      value: {
        lte: 1,
      },
    },
    {
      label: "1< N <=2",
      value: {
        gt: 1,
        lte: 2,
      },
    },
    {
      label: "2< N <=3",
      value: {
        gt: 2,
        lte: 3,
      },
    },
    {
      label: ">3",
      value: {
        gt: 3,
      },
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

  const options: FilterNumberOption[] = [
    {
      label: "P<=0.5",
      value: {
        lte: 0.5,
      },
    },
    {
      label: "0.5< P <=1",
      value: {
        gt: 0.5,
        lte: 1,
      },
    },
    {
      label: "1< P <=2",
      value: {
        gt: 1,
        lte: 2,
      },
    },
    {
      label: "P>2",
      value: {
        gt: 2,
      },
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

  const options: FilterNumberOption[] = [
    {
      label: "K<=1",
      value: {
        lte: 1,
      },
    },
    {
      label: "1< K <=1.5",
      value: {
        gt: 1,
        lte: 1.5,
      },
    },
    {
      label: "1.5< K <=2",
      value: {
        gt: 1.5,
        lte: 2,
      },
    },
    {
      label: "K>2",
      value: {
        gt: 2,
      },
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
    <div className="flex gap-2 lg:flex-row flex-col">
      <SoilsFacetedNutrientNitrogen />
      <SoilsFacetedNutrientPhosphorus />
      <SoilsFacetedNutrientPotassium />
    </div>
  );
};
