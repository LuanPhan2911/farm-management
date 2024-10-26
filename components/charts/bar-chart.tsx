"use client";

import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ReactNode, useContext } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  NameType,
  Payload,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { ErrorButton } from "../buttons/error-button";
import { LargeCard } from "../cards/large-card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Skeleton } from "../ui/skeleton";
import { ChartContext } from "./chart-wrapper";

interface BarChartContentProps<T extends Record<string, any>> {
  data: T[] | undefined;
  isPending: boolean;
  isError: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<T[], Error>>;

  chartConfig: ChartConfig;
  chartData: (data: T[]) => any[] | undefined;
  XAxisKey: keyof T;
  t: (key: string, object?: Record<string, any>) => string;
  tickFormatter?: ((value: any, index: number) => string) | undefined;
  labelFormatter?:
    | ((label: any, payload: Payload<ValueType, NameType>[]) => ReactNode)
    | undefined;
}
export const BarChartContent = <T extends Record<string, any>>({
  data,
  isError,
  isPending,
  t,
  chartConfig,
  refetch,
  XAxisKey,
  tickFormatter,
  labelFormatter,
  chartData,
}: BarChartContentProps<T>) => {
  const { isShown } = useContext(ChartContext);
  if (!isShown) {
    return (
      <LargeCard
        title={t("hidden.title")}
        description={t("hidden.description")}
      />
    );
  }
  if (isPending) {
    return <Skeleton className="w-full min-h-[200px]"></Skeleton>;
  }
  if (isError) {
    return (
      <LargeCard
        title={<ErrorButton title={t("error.title")} refresh={refetch} />}
        description={t("error.description")}
      />
    );
  }
  if (!data?.length) {
    return (
      <LargeCard
        title={t("notFound.title")}
        description={t("notFound.description")}
      />
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData(data)}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={XAxisKey as string}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={tickFormatter}
        />
        <YAxis />
        <ChartTooltip
          content={<ChartTooltipContent />}
          labelFormatter={labelFormatter}
        />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(chartConfig).map((key) => {
          return (
            <Bar
              dataKey={key}
              fill={`var(--color-${key})`}
              radius={4}
              key={key}
            />
          );
        })}
      </BarChart>
    </ChartContainer>
  );
};
