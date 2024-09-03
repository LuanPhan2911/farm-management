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
import { useSearchParams } from "next/navigation";
import { OrderByButton } from "@/components/buttons/order-by-button";
interface WeathersTableProps {
  data: WeatherTable[];
  totalPage: number;
}
export const WeathersTable = ({ data, totalPage }: WeathersTableProps) => {
  const t = useTranslations("weathers");
  const searchParams = useSearchParams();
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="flex items-center gap-x-2">
                {t("table.thead.createdAt")}{" "}
                <OrderByButton value="createdAt_desc" />{" "}
              </TableHead>
              <TableHead>{t("table.thead.status")} </TableHead>
              <TableHead>{t("table.thead.temperature")}</TableHead>
              <TableHead>{t("table.thead.humidity")}</TableHead>
              <TableHead>{t("table.thead.atmosphericPressure")} </TableHead>
              <TableHead>{t("table.thead.rainfall")} </TableHead>
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
                      : "No confirmed"}
                  </TableCell>
                  <TableCell>
                    {item.confirmedBy ? (
                      <StaffWithName {...item.confirmedBy} />
                    ) : (
                      "No confirmed"
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
