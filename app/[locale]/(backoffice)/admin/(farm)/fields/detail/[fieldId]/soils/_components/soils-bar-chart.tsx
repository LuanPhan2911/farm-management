"use client";

import { BarChartContent } from "@/components/charts/bar-chart";
import { ChartContext, ChartWrapper } from "@/components/charts/chart-wrapper";
import { DatePickerInRange } from "@/components/form/date-picker-in-range";

import { ChartConfig } from "@/components/ui/chart";
import { SoilChart } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { useFormatter, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import queryString from "query-string";
import { useContext, useState } from "react";
import { DateRange } from "react-day-picker";

const inDays = 14;
export const SoilsBarChart = () => {
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
          <>
            <DatePickerInRange
              value={dateRange}
              defaultValue={dateRange}
              onChange={setDateRange}
              disabledDateRange={{
                after: addDays(new Date(), 1),
              }}
              inDays={inDays}
            />
          </>
        );
      }}
    >
      <SoilsBarChartContent />
    </ChartWrapper>
  );
};

const SoilsBarChartContent = () => {
  const params = useParams<{
    fieldId: string;
  }>();
  const { query } = useContext(ChartContext);
  const t = useTranslations("soils.chart");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["soils_chart", query],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/fields/${params!.fieldId}/soils/chart`,
          query,
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
    nutrientNitrogen: {
      label: t("fields.nutrientNitrogen", {
        unit: "g/kg",
      }),
      color: "hsl(var(--chart-2))",
    },
    nutrientPhosphorus: {
      label: t("fields.nutrientPhosphorus", {
        unit: "g/kg",
      }),
      color: "hsl(var(--chart-3))",
    },
    nutrientPotassium: {
      label: t("fields.nutrientPotassium", {
        unit: "g/kg",
      }),
      color: "hsl(var(--chart-4))",
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
        return data;
      }}
    />
  );
};
