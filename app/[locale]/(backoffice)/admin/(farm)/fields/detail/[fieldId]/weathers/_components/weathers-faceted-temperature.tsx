"use client";

import { FacetedFilterNumberButton } from "@/components/buttons/faceted-filter-number-button";
import { useTranslations } from "next-intl";

export const WeathersFacetedTemperature = () => {
  const t = useTranslations("weathers.search.faceted");
  const options = [
    {
      label: ">=40",
      value: ">=40",
    },
    {
      label: ">=30",
      value: ">=30",
    },
    {
      label: ">=20",
      value: ">=20",
    },
    {
      label: "<=10",
      value: "<=10",
    },
    {
      label: "<=0",
      value: "<=0",
    },
  ];
  return (
    <FacetedFilterNumberButton
      options={options}
      column="temperature.value"
      title={t("temperature.placeholder")}
    />
  );
};
