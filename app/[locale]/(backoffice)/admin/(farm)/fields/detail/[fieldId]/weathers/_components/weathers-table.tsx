"use client";

import { NavPagination } from "@/components/nav-pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormatter, useTranslations } from "next-intl";
import { WeatherCreateButton } from "./weather-create-button";
import { UnitSuperscriptWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-superscript";
import { WeatherTable } from "@/types";
import { WeathersTableAction } from "./weathers-table-action";
import { WeatherConfirmButton } from "./weather-confirm-button";
import { StaffWithName } from "@/app/[locale]/(backoffice)/admin/_components/staff-with-name";
import { WeatherStatusValue } from "./weather-status-value";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { WeatherStatus } from "@prisma/client";
import { FacetedFilterStringButton } from "@/components/buttons/faceted-filter-string-button";
import { FacetedFilterNumberButton } from "@/components/buttons/faceted-filter-number-button";
import { DatePickerWithRange } from "@/components/form/date-picker-with-range";
import { DateRange } from "react-day-picker";
import { addDays, format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/navigation";
import { useState } from "react";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { WeatherTableFaceted } from "./weathers-table-faceted";
interface WeathersTableProps {
  data: WeatherTable[];
  totalPage: number;
}
export const WeathersTable = ({ data, totalPage }: WeathersTableProps) => {
  const t = useTranslations("weathers");
  const { dateTime, relativeTime } = useFormatter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("page.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <WeatherCreateButton />
        </div>
        <DatePickerWithRangeButton from={new Date()} />
        <WeatherTableFaceted />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <OrderByButton
                  column="createdAt"
                  label={t("table.thead.createdAt")}
                />
              </TableHead>
              <TableHead>{t("table.thead.status")} </TableHead>
              <TableHead>
                <OrderByButton
                  column="temperature.value"
                  label={t("table.thead.temperature")}
                />
              </TableHead>
              <TableHead>
                <OrderByButton
                  column="humidity.value"
                  label={t("table.thead.humidity")}
                />
              </TableHead>
              <TableHead>
                <OrderByButton
                  column="atmosphericPressure.value"
                  label={t("table.thead.atmosphericPressure")}
                />
              </TableHead>
              <TableHead>
                <OrderByButton
                  column="rainfall.value"
                  label={t("table.thead.rainfall")}
                />
              </TableHead>
              <TableHead>{t("table.thead.confirmed")} </TableHead>
              <TableHead>{t("table.thead.confirmedAt")} </TableHead>
              <TableHead>{t("table.thead.confirmedBy")} </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => {
              return (
                <TableRow key={item.id} className="cursor-pointer">
                  <TableCell>
                    {dateTime(item.createdAt, {
                      hour: "2-digit",
                      minute: "2-digit",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <WeatherStatusValue status={item.status} />
                  </TableCell>
                  <TableCell>
                    <span>
                      {item.temperature.value}
                      <sup>o</sup>
                      {item.temperature.unit.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <UnitSuperscriptWithValue
                      value={item.humidity.value}
                      unit={item.humidity.unit.name}
                    />
                  </TableCell>
                  <TableCell>
                    <UnitSuperscriptWithValue
                      value={item.atmosphericPressure.value}
                      unit={item.atmosphericPressure.unit.name}
                    />
                  </TableCell>
                  <TableCell>
                    <UnitSuperscriptWithValue
                      value={item.rainfall.value}
                      unit={item.rainfall.unit.name}
                    />
                  </TableCell>
                  <TableCell>
                    <WeatherConfirmButton
                      confirmed={item.confirmed}
                      weatherId={item.id}
                    />
                  </TableCell>
                  <TableCell>
                    {item.confirmedAt
                      ? relativeTime(item.confirmedAt)
                      : t("table.trow.confirmedAt")}
                  </TableCell>
                  <TableCell>
                    {item.confirmedBy ? (
                      <StaffWithName {...item.confirmedBy} />
                    ) : (
                      t("table.trow.confirmedBy")
                    )}
                  </TableCell>
                  <TableCell>
                    <WeathersTableAction data={item} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="py-4">
          <NavPagination totalPage={totalPage} />
        </div>
      </CardContent>
    </Card>
  );
};
