"use client";

import {
  FacetedFilterNumberButton,
  FilterNumberOption,
} from "@/components/buttons/faceted-filter-number-button";
import { useTranslations } from "next-intl";
import { ErrorButton } from "@/components/buttons/error-button";
import { FacetedFilterStringButton } from "@/components/buttons/faceted-filter-string-button";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherStatusCount } from "@/types";
import { WeatherStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

import { useParams, useSearchParams } from "next/navigation";
import queryString from "query-string";

const WeathersFacetedStatus = () => {
  const { fieldId } = useParams<{
    fieldId: string;
  }>()!;
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
  const options: FilterNumberOption[] = [
    {
      label: "Temp <=20",
      value: {
        lte: 20,
      },
    },
    {
      label: "20< Temp <=25",
      value: {
        gt: 20,
        lte: 25,
      },
    },
    {
      label: "25< Temp <=30",
      value: {
        gt: 25,
        lte: 30,
      },
    },
    {
      label: "30< Temp <=35",
      value: {
        gt: 30,
        lte: 35,
      },
    },
    {
      label: "Temp >= 35",
      value: {
        gt: 35,
      },
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
const WeathersFacetedHumidity = () => {
  const t = useTranslations("weathers.search.faceted");

  const options: FilterNumberOption[] = [
    {
      label: "Humid <=30%",
      value: {
        lte: 30,
      },
    },
    {
      label: "30%< Humid <=50%",
      value: {
        gt: 30,
        lte: 50,
      },
    },
    {
      label: "50%< Humid <=70%",
      value: {
        gt: 50,
        lte: 70,
      },
    },
    {
      label: "Humid >70%",
      value: {
        gt: 70,
      },
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

  const options: FilterNumberOption[] = [
    {
      label: "Rainfall=0",
      value: {
        equals: 0,
      },
    },
    {
      label: "0< Rain <=10",
      value: {
        gt: 0,
        lte: 10,
      },
    },
    {
      label: "10< Rain <=25",
      value: {
        gt: 10,
        lte: 25,
      },
    },
    {
      label: "25< Rain <=50",
      value: {
        gt: 25,
        lte: 50,
      },
    },
    {
      label: "Rain >50",
      value: {
        gt: 50,
      },
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
