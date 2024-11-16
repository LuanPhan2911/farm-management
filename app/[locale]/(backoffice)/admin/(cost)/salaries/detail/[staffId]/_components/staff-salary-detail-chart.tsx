"use client";

import { BarChartContent } from "@/components/charts/bar-chart";
import { ChartContext, ChartWrapper } from "@/components/charts/chart-wrapper";
import { ChartConfig } from "@/components/ui/chart";
import { SalaryChart } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useFormatter, useTranslations } from "next-intl";
import queryString from "query-string";
import { useContext } from "react";

interface StaffSalaryDetailChartProps {
  staffId: string;
}
export const StaffSalaryDetailChart = ({
  staffId,
}: StaffSalaryDetailChartProps) => {
  return (
    <ChartWrapper
      query={{
        staffId,
      }}
    >
      <StaffSalaryDetailChartContent />
    </ChartWrapper>
  );
};

export const StaffSalaryDetailChartContent = () => {
  const t = useTranslations("salaries.chart.salaryDetail");

  const { query } = useContext(ChartContext);
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["salaries_detail_chart", query],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/staffs/salaries/detail/chart`,
          query,
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as SalaryChart[];
    },
  });
  const { dateTime } = useFormatter();
  const chartConfig = {
    totalSalary: {
      label: t("fields.totalSalary"),
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
      XAxisKey="month"
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
export const StaffHourlyWorkChart = ({
  staffId,
}: StaffSalaryDetailChartProps) => {
  return (
    <ChartWrapper
      query={{
        staffId,
      }}
    >
      <StaffHourlyWorkChartContent />
    </ChartWrapper>
  );
};

export const StaffHourlyWorkChartContent = () => {
  const t = useTranslations("salaries.chart.hourlyWorkDetail");
  const { query } = useContext(ChartContext);
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["salaries_detail_chart", query],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: `/api/staffs/salaries/detail/chart`,
          query,
        },
        {
          skipEmptyString: true,
          skipNull: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as SalaryChart[];
    },
  });

  const { dateTime } = useFormatter();
  const chartConfig = {
    totalHourlyWork: {
      label: t("fields.totalHourlyWork"),
      color: "hsl(var(--chart-2))",
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
      XAxisKey="month"
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
