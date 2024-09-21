"use client";

import { NavPagination } from "@/components/nav-pagination";
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
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { WeatherTable } from "@/types";
import { WeathersTableAction } from "./weathers-table-action";
import { WeatherConfirmButton } from "./weather-confirm-button";
import { WeatherStatusValue } from "./weather-status-value";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { WeatherTableFaceted } from "./weathers-table-faceted";
import { SelectItemContent } from "@/components/form/select-item";
interface WeathersTableProps {
  data: WeatherTable[];
  totalPage: number;
}
export const WeathersTable = ({ data, totalPage }: WeathersTableProps) => {
  const t = useTranslations("weathers.table");
  const { dateTime, relativeTime } = useFormatter();

  return (
    <div className="flex flex-col gap-y-4 p-4 border rounded-lg max-w-6xl my-4">
      <div className="flex justify-end">
        <WeatherCreateButton />
      </div>
      <DatePickerWithRangeButton from={undefined} />
      <WeatherTableFaceted />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <OrderByButton
                column="createdAt"
                label={t("thead.createdAt")}
                defaultValue="desc"
              />
            </TableHead>
            <TableHead>{t("thead.status")} </TableHead>
            <TableHead>
              <OrderByButton
                column="temperature.value"
                label={t("thead.temperature")}
              />
            </TableHead>
            <TableHead>
              <OrderByButton
                column="humidity.value"
                label={t("thead.humidity")}
              />
            </TableHead>
            <TableHead>
              <OrderByButton
                column="atmosphericPressure.value"
                label={t("thead.atmosphericPressure")}
              />
            </TableHead>
            <TableHead>
              <OrderByButton
                column="rainfall.value"
                label={t("thead.rainfall")}
              />
            </TableHead>
            <TableHead>{t("thead.confirmed")} </TableHead>
            <TableHead>{t("thead.confirmedAt")} </TableHead>
            <TableHead>{t("thead.confirmedBy")} </TableHead>
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
                  {item.temperature ? (
                    <span>
                      {item.temperature?.value}
                      <sup>o</sup>
                      {item.temperature?.unit.name}
                    </span>
                  ) : (
                    t("trow.temperature")
                  )}
                </TableCell>
                <TableCell>
                  {item.humidity ? (
                    <UnitWithValue
                      value={item.humidity?.value}
                      unit={item.humidity?.unit.name}
                    />
                  ) : (
                    t("trow.humidity")
                  )}
                </TableCell>
                <TableCell>
                  {item.atmosphericPressure ? (
                    <UnitWithValue
                      value={item.atmosphericPressure?.value}
                      unit={item.atmosphericPressure?.unit.name}
                    />
                  ) : (
                    t("trow.atmosphericPressure")
                  )}
                </TableCell>
                <TableCell>
                  {item.rainfall ? (
                    <UnitWithValue
                      value={item.rainfall?.value}
                      unit={item.rainfall?.unit.name}
                    />
                  ) : (
                    t("trow.rainfall")
                  )}
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
                    : t("trow.confirmedAt")}
                </TableCell>
                <TableCell>
                  {item.confirmedBy ? (
                    <SelectItemContent
                      imageUrl={item.confirmedBy.imageUrl}
                      title={item.confirmedBy.name}
                    />
                  ) : (
                    t("trow.confirmedBy")
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
    </div>
  );
};
