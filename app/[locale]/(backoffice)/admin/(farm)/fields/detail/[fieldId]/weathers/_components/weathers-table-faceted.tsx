"use client";

import { FacetedFilterNumberButton } from "@/components/buttons/faceted-filter-number-button";
import { useTranslations } from "next-intl";
import { ErrorButton } from "@/components/buttons/error-button";
import { FacetedFilterStringButton } from "@/components/buttons/faceted-filter-string-button";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherStatusCount } from "@/types";
import { WeatherStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { useParams, useSearchParams } from "next/navigation";
import queryString from "query-string";

const WeathersFacetedHumidity = () => {
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
const WeathersFacetedRainfall = () => {
  const t = useTranslations("weathers.search.faceted");

  const options = [
    {
      label: "<=5",
      value: "<=5",
    },
    {
      label: ">=10",
      value: ">=10",
    },
    {
      label: ">=30",
      value: ">=30",
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

const WeathersFacetedStatus = () => {
  const { fieldId } = useParams<{
    fieldId: string;
  }>();
  const searchParams = useSearchParams();
  const begin = searchParams!.get("begin");
  const end = searchParams!.get("end");
  const filterString = searchParams!.get("filterString");
  const t = useTranslations("weathers");
  const options = Object.values(WeatherStatus).map((item) => ({
    label: t(`schema.status.options.${item}`),
    value: item,
  }));
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["weathers_count_status", filterString, begin, end],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/fields/${fieldId}/weathers/count_status`,
          query: {
            filterString,
            begin,
            end,
          },
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as WeatherStatusCount[];
    },
  });

  if (isPending) {
    return <Skeleton className="w-32 h-8"></Skeleton>;
  }
  if (isError) {
    return (
      <ErrorButton title={t("search.faceted.status.error")} refresh={refetch} />
    );
  }
  const counts = data.reduce(
    (obj, item) => ({ ...obj, [item.status]: item._count }),
    {}
  );
  return (
    <FacetedFilterStringButton
      options={options}
      column="status"
      title={t("search.faceted.status.placeholder")}
      counts={counts}
    />
  );
};

const WeathersFacetedTemperature = () => {
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

export const WeatherTableFaceted = () => {
  return (
    <div className="flex gap-2 my-2 lg:flex-row flex-col">
      <WeathersFacetedStatus />
      <WeathersFacetedTemperature />
      <WeathersFacetedHumidity />
      <WeathersFacetedRainfall />
    </div>
  );
};
