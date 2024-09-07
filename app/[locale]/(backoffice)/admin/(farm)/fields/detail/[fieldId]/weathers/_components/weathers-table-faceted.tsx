"use client";
import { FacetedFilterNumberButton } from "@/components/buttons/faceted-filter-number-button";
import { FacetedFilterStringButton } from "@/components/buttons/faceted-filter-string-button";
import { WeatherStatus } from "@prisma/client";
import { useTranslations } from "next-intl";

export const WeatherTableFaceted = () => {
  const t = useTranslations("weathers");
  const statusOptions = Object.values(WeatherStatus).map((item) => ({
    label: t(`schema.status.options.${item}`),
    value: item,
  }));
  const temperatureOptions = [
    {
      label: "<=30",
      value: "<=30",
    },
    {
      label: ">=40",
      value: ">=40",
    },
  ];
  const humidityOptions = [
    {
      label: "<=50",
      value: "<=50",
    },
    {
      label: ">=50",
      value: ">=50",
    },
  ];
  return (
    <div className="flex gap-x-2 my-2">
      <FacetedFilterStringButton
        options={statusOptions}
        column="status"
        title={t("search.faceted.status.placeholder")}
      />
      <FacetedFilterNumberButton
        options={temperatureOptions}
        column="temperature.value"
        title={t("search.faceted.temperature.placeholder")}
      />
      <FacetedFilterNumberButton
        options={humidityOptions}
        column="humidity.value"
        title={t("search.faceted.humidity.placeholder")}
      />
    </div>
  );
};
