"use client";

import { ChartContext, ChartWrapper } from "@/components/charts/chart-wrapper";
import { PieChartContent } from "@/components/charts/pie-chart";
import { DatePickerInRange } from "@/components/form/date-picker-in-range";
import { ChartConfig } from "@/components/ui/chart";
import { ActivityPriorityCount, ActivityStatusCount } from "@/types";
import { ActivityPriority, ActivityStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { addDays } from "date-fns";
import { useTranslations } from "next-intl";
import queryString from "query-string";
import { useContext, useState } from "react";
import { DateRange } from "react-day-picker";

const inDays = 7;
export const ActivitiesStatusPieChart = () => {
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
      <ActivitiesStatusPieChartContent />
    </ChartWrapper>
  );
};

const ActivitiesStatusPieChartContent = () => {
  const { query } = useContext(ChartContext);
  const t = useTranslations("activities.chart.countStatus");
  const tSchema = useTranslations("activities.schema.status.options");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["activities_count_status", query],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/activities/count_status`,
          query,
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as ActivityStatusCount[];
    },
  });

  const chartConfig = {
    ...Object.values(ActivityStatus).reduce((init, item, index) => {
      return {
        ...init,
        [item]: {
          label: tSchema(item),
          color: `hsl(var(--chart-${index + 1}))`,
        },
      };
    }, {}),
    _count: {
      label: t("fields._count"),
    },
  } satisfies ChartConfig;

  return (
    <PieChartContent
      isError={isError}
      isPending={isPending}
      chartConfig={chartConfig}
      refetch={refetch}
      t={t}
      data={data}
      chartData={(data) =>
        data.map((item) => {
          return {
            ...item,
            fill: `var(--color-${item.status})`,
          };
        })
      }
      dataKey="_count"
      nameKey="status"
    />
  );
};

export const ActivitiesPriorityPieChart = () => {
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
      <ActivitiesPriorityPieChartContent />
    </ChartWrapper>
  );
};
const ActivitiesPriorityPieChartContent = () => {
  const { query } = useContext(ChartContext);
  const t = useTranslations("activities.chart.countPriority");
  const tSchema = useTranslations("activities.schema.priority.options");
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["activities_priority_status", query],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/activities/count_priority`,
          query,
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as ActivityPriorityCount[];
    },
  });

  const chartConfig = {
    ...Object.values(ActivityPriority).reduce((init, item, index) => {
      return {
        ...init,
        [item]: {
          label: tSchema(item),
          color: `hsl(var(--chart-${index + 1}))`,
        },
      };
    }, {}),

    _count: {
      label: t("fields._count"),
    },
  } satisfies ChartConfig;

  return (
    <PieChartContent
      isError={isError}
      isPending={isPending}
      chartConfig={chartConfig}
      refetch={refetch}
      t={t}
      data={data}
      chartData={(data) =>
        data.map((item) => {
          return {
            ...item,
            fill: `var(--color-${item.priority})`,
          };
        })
      }
      dataKey="_count"
      nameKey="priority"
    />
  );
};
