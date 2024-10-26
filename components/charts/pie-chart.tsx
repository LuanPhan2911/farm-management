"use client";

import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useContext } from "react";
import { Pie, PieChart } from "recharts";
import { ErrorButton } from "../buttons/error-button";
import { LargeCard } from "../cards/large-card";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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

interface PieChartContentProps<T extends unknown> {
  data: T[] | undefined;
  isPending: boolean;
  isError: boolean;
  refetch: (
    options?: RefetchOptions
  ) => Promise<QueryObserverResult<T[], Error>>;

  chartConfig: ChartConfig;
  chartData: (data: T[]) => any[];
  dataKey: keyof T;
  nameKey: keyof T;
  t: (key: string, object?: Record<string, any>) => string;
}
export const PieChartContent = <T extends unknown>({
  chartConfig,
  chartData,
  data,
  isError,
  isPending,
  refetch,
  t,
  dataKey,
  nameKey,
}: PieChartContentProps<T>) => {
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
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] "
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey={nameKey as string} />}
            />
            <Pie
              data={chartData(data)}
              dataKey={dataKey as string}
              nameKey={nameKey as string}
              stroke="0"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
