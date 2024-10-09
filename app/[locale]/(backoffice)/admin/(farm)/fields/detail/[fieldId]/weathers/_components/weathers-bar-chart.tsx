"use client";

import { ErrorButton } from "@/components/buttons/error-button";
import { LargeCard } from "@/components/cards/large-card";
import { DatePickerInRange } from "@/components/form/date-picker-in-range";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { WeatherChart } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { Eye, EyeOff, LucideIcon } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import queryString from "query-string";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface WeathersBarChartProps {}

export const WeathersBarChart = ({}: WeathersBarChartProps) => {
  const defaultDateRange: DateRange = {
    from: addDays(new Date(), -7),
    to: new Date(),
  };

  const [dateRange, setDateRange] = useState<DateRange>({
    ...defaultDateRange,
  });
  const [isShown, setShown] = useState<boolean>(true);
  const Icon: LucideIcon = isShown ? EyeOff : Eye;
  const t = useTranslations("weathers.chart");
  return (
    <div className="flex flex-col gap-y-4 p-4 max-w-full border rounded-lg">
      <div className="flex justify-between">
        <DatePickerInRange
          dateRange={dateRange}
          defaultDateRange={defaultDateRange}
          setDateRange={setDateRange}
          inDays={7}
        />
        <Hint label="Show/Hide chart" asChild>
          <Button
            size={"icon"}
            variant={"cyan"}
            onClick={() => setShown(!isShown)}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </Hint>
      </div>
      {isShown ? (
        <WeathersBarChartContent dateRange={dateRange} />
      ) : (
        <LargeCard
          title={t("hidden.title")}
          description={t("hidden.description")}
        />
      )}
    </div>
  );
};

interface WeathersBarChartContentProps {
  dateRange: DateRange;
}
const WeathersBarChartContent = ({
  dateRange,
}: WeathersBarChartContentProps) => {
  const params = useParams<{
    fieldId: string;
  }>();
  const t = useTranslations("weathers.chart");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["weathers_chart", dateRange],
    queryFn: async () => {
      const { from: begin, to: end } = dateRange;
      const url = queryString.stringifyUrl(
        {
          url: `/api/fields/${params!.fieldId}/weathers/chart`,
          query: {
            begin: begin?.toISOString(),
            end: end?.toISOString(),
          },
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as WeatherChart[];
    },
  });
  const { dateTime } = useFormatter();
  const chartConfig = {
    temperature: {
      label: t("fields.temperature"),
      color: "hsl(var(--chart-1))",
    },
    humidity: {
      label: t("fields.humidity"),
      color: "hsl(var(--chart-2))",
    },
    rainfall: {
      label: t("fields.rainfall"),
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

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
  if (!data.length) {
    return (
      <LargeCard
        title={t("notFound.title")}
        description={t("notFound.description")}
      />
    );
  }
  const chartData = data.map((item) => {
    const { temperature, humidity, rainfall } = item;
    return {
      createdAt: item.createdAt,
      temperature: temperature?.value || 0,
      humidity: humidity?.value || 0,
      rainfall: rainfall?.value || 0,
    };
  });
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] max-w-6xl">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="createdAt"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => {
            return dateTime(new Date(value), {
              day: "2-digit",
              month: "short",
              hour: "numeric",
            });
          }}
        />
        <YAxis />
        <ChartTooltip
          content={<ChartTooltipContent />}
          labelFormatter={(label) => {
            return dateTime(new Date(label), {
              day: "2-digit",
              month: "short",
              hour: "numeric",
            });
          }}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="temperature" fill="var(--color-temperature)" radius={4} />
        <Bar dataKey="humidity" fill="var(--color-humidity)" radius={4} />
        <Bar dataKey="rainfall" fill="var(--color-rainfall)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
