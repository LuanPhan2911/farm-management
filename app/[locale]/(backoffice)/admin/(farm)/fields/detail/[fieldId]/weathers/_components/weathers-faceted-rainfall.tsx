"use client";

import { FacetedFilterNumberButton } from "@/components/buttons/faceted-filter-number-button";
import { useTranslations } from "next-intl";

export const WeathersFacetedRainfall = () => {
  const t = useTranslations("weathers.search.faceted");

  const options = [
    {
      label: "<=10",
      value: "<=10",
    },
    {
      label: "<=25",
      value: "<=25",
    },
    {
      label: ">=50",
      value: ">=50",
    },
  ];
  return (
    <FacetedFilterNumberButton
      options={options}
      column="rainfall.value"
      title={t("rainfall.placeholder")}
    />
  );
};
