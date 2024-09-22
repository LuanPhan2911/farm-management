"use client";

import { ErrorButton } from "@/components/buttons/error-button";
import { DatePickerInRange } from "@/components/form/date-picker-in-range";
import { QueryProvider } from "@/components/providers/query-provider";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { SoilChart } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { useFormatter, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import queryString from "query-string";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface SoilsBarChartProps {}

export const SoilsBarChart = ({}: SoilsBarChartProps) => {
  const defaultDateRange: DateRange = {
    from: addDays(new Date(), -7),
    to: new Date(),
  };

  const [dateRange, setDateRange] = useState<DateRange>({
    ...defaultDateRange,
  });

  return (
    <div className="flex flex-col gap-y-4 p-4 max-w-6xl border rounded-lg">
      <DatePickerInRange
        dateRange={dateRange}
        defaultDateRange={defaultDateRange}
        setDateRange={setDateRange}
        inDays={14}
      />
      <SoilsBarChartContentWithQueryClient dateRange={dateRange} />
    </div>
  );
};

interface SoilsBarChartContentProps {
  dateRange: DateRange;
}
const SoilsBarChartContent = ({ dateRange }: SoilsBarChartContentProps) => {
  const params = useParams<{
    fieldId: string;
  }>();
  const t = useTranslations("soils.chart");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["soils_chart", dateRange],
    queryFn: async () => {
      const { from: begin, to: end } = dateRange;
      const url = queryString.stringifyUrl(
        {
          url: `/api/fields/${params.fieldId}/soils/chart`,
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
      return (await res.json()) as SoilChart[];
    },
  });
  const { dateTime } = useFormatter();
  const chartConfig = {
    ph: {
      label: t("fields.ph"),
      color: "hsl(var(--chart-1))",
    },
    nutrientNitrogen: {
      label: t("fields.nutrientNitrogen"),
      color: "hsl(var(--chart-2))",
    },
    nutrientPhosphorus: {
      label: t("fields.nutrientPhosphorus"),
      color: "hsl(var(--chart-3))",
    },
    nutrientPotassium: {
      label: t("fields.nutrientPotassium"),
      color: "hsl(var(--chart-4))",
    },
  } satisfies ChartConfig;

  if (isPending) {
    return <Skeleton className="w-full min-h-[200px]"></Skeleton>;
  }
  if (isError) {
    return (
      <div className="flex flex-col gap-y-2 items-center justify-center py-4">
        <div className="text-lg font-semibold">
          <ErrorButton title={t("error.title")} refresh={refetch} />
        </div>
        <div className="text-sm text-muted-foreground">
          {t("error.description")}
        </div>
      </div>
    );
  }
  if (!data.length) {
    return (
      <div className="flex flex-col gap-y-2 items-center justify-center py-4 min-h-[200px]">
        <div className="text-lg font-semibold">{t("notFound.title")}</div>
        <div className="text-sm text-muted-foreground text-center">
          {t("notFound.description")}
        </div>
      </div>
    );
  }
  const chartData = data.map((item) => {
    const {
      ph,
      nutrientNitrogen,
      nutrientPhosphorus,
      nutrientPotassium,
      createdAt,
    } = item;
    return {
      createdAt,
      ph,
      nutrientNitrogen,
      nutrientPhosphorus,
      nutrientPotassium,
    };
  });
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
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
        <Bar dataKey="ph" fill="var(--color-ph)" radius={4} />
        <Bar
          dataKey="nutrientNitrogen"
          fill="var(--color-nutrientNitrogen)"
          radius={4}
        />
        <Bar
          dataKey="nutrientPhosphorus"
          fill="var(--color-nutrientPhosphorus)"
          radius={4}
        />
        <Bar
          dataKey="nutrientPotassium"
          fill="var(--color-nutrientPotassium)"
          radius={4}
        />
      </BarChart>
    </ChartContainer>
  );
};
export const SoilsBarChartContentWithQueryClient = (
  props: SoilsBarChartContentProps
) => {
  return (
    <QueryProvider>
      <SoilsBarChartContent {...props} />
    </QueryProvider>
  );
};
