"use client";

import { BarChartContent } from "@/components/charts/bar-chart";
import { ChartWrapper } from "@/components/charts/chart-wrapper";
import { ChartConfig } from "@/components/ui/chart";
import { dataToChartConfig } from "@/lib/utils";
import { MaterialUsedChart, MaterialMostUsedChart } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { useFormatter, useTranslations } from "next-intl";
import queryString from "query-string";

export const MaterialUsageCostChart = () => {
  return (
    <ChartWrapper>
      <MaterialUsageCostChartContent />
    </ChartWrapper>
  );
};

export const MaterialUsageCostChartContent = () => {
  const t = useTranslations("materials.chart.materialUsage");

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["material_usage"],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/materials/usages/chart`,
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as MaterialUsedChart[];
    },
  });
  const { dateTime } = useFormatter();
  const chartConfig = {
    totalCost: {
      label: t("fields.totalCost"),
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  const description =
    data && data.length > 0
      ? `${format(data[0].month, "MMMM yyyy")} - ${format(
          data[data.length - 1].month,
          "MMMM yyyy"
        )}`
      : null;

  return (
    <BarChartContent
      isError={isError}
      isPending={isPending}
      chartConfig={chartConfig}
      refetch={refetch}
      t={t}
      xAxisKey="month"
      labelFormatter={(label) =>
        dateTime(new Date(label), {
          month: "long",
        })
      }
      tickFormatter={(value) =>
        dateTime(new Date(value), {
          month: "long",
        })
      }
      data={data}
      chartData={(data) => {
        return data;
      }}
      description={description}
    />
  );
};
export const MaterialMostUsageChart = () => {
  return (
    <ChartWrapper>
      <MaterialMostUsageChartContent />
    </ChartWrapper>
  );
};

export const MaterialMostUsageChartContent = () => {
  const t = useTranslations("materials.chart.materialMostUsage");

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["material_most_usages"],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/materials/most_usages/chart`,
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as MaterialMostUsedChart[];
    },
  });

  const chartConfig = {
    quantityUsed: {
      label: t("fields.quantityUsed"),
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const description = `${format(
    startOfMonth(new Date()),
    "dd MMM yyyy"
  )} - ${format(endOfMonth(new Date()), "dd MMM yyyy")}`;
  return (
    <BarChartContent
      isError={isError}
      isPending={isPending}
      chartConfig={chartConfig}
      refetch={refetch}
      t={t}
      xAxisKey="name"
      data={data}
      chartData={(data) => data}
      description={description}
    />
  );
};
