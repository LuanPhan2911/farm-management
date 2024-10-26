"use client";

import { BarChartContent } from "@/components/charts/bar-chart";
import { ChartContext, ChartWrapper } from "@/components/charts/chart-wrapper";
import { DatePickerInRange } from "@/components/form/date-picker-in-range";
import { ChartConfig } from "@/components/ui/chart";
import { WeatherChart } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { useFormatter, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useState } from "react";
import { DateRange } from "react-day-picker";

const inDays = 7;
export const WeathersBarChart = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -inDays),
    to: new Date(),
  });
  return (
    <ChartWrapper
      query={{
        begin: dateRange.from?.toISOString(),
        end: dateRange.to?.toISOString(),
      }}
      renderQuery={() => {
        return (
          <div>
            <DatePickerInRange
              value={dateRange}
              defaultValue={dateRange}
              onChange={setDateRange}
              disabledDateRange={{
                after: addDays(new Date(), 1),
              }}
              inDays={inDays}
            />
          </div>
        );
      }}
    >
      <WeathersBarChartContent />
    </ChartWrapper>
  );
};

const WeathersBarChartContent = () => {
  const params = useParams<{
    fieldId: string;
  }>();
  const { query } = useContext(ChartContext);
  const t = useTranslations("weathers.chart");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["weathers_chart", query],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/fields/${params!.fieldId}/weathers/chart`,
          query,
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
      label: t("fields.temperature", {
        unit: "C",
      }),
      color: "hsl(var(--chart-1))",
    },
    humidity: {
      label: t("fields.humidity", {
        unit: "%",
      }),
      color: "hsl(var(--chart-2))",
    },
    rainfall: {
      label: t("fields.rainfall", {
        unit: "mm",
      }),
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <BarChartContent
      isError={isError}
      isPending={isPending}
      chartConfig={chartConfig}
      refetch={refetch}
      t={t}
      XAxisKey="createdAt"
      labelFormatter={(label) => dateTime(new Date(label), "short")}
      tickFormatter={(value) => dateTime(new Date(value), "short")}
      data={data}
      chartData={(data) => {
        return data.map((item) => {
          const { temperature, humidity, rainfall } = item;
          return {
            createdAt: item.createdAt,
            temperature: temperature?.value || 0,
            humidity: humidity?.value || 0,
            rainfall: rainfall?.value || 0,
          };
        });
      }}
    />
  );
};
