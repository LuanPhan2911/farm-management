"use client";

import { FacetedFilterNumberButton } from "@/components/buttons/faceted-filter-number-button";
import { useTranslations } from "next-intl";

export const WeathersFacetedHumidity = () => {
  const t = useTranslations("weathers.search.faceted");

  const options = [
    {
      label: "<=10",
      value: "<=10",
    },
    {
      label: "<=30",
      value: "<=30",
    },
    {
      label: ">30",
      value: ">30",
    },
    {
      label: ">=50",
      value: ">=50",
    },
  ];
  return (
    <FacetedFilterNumberButton
      options={options}
      column="humidity.value"
      title={t("humidity.placeholder")}
    />
  );
};
