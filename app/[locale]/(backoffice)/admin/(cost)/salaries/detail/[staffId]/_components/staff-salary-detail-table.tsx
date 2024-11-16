"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormatter, useTranslations } from "next-intl";
import { SearchBar } from "@/components/search-bar";
import { StaffWithSalaryAndActivity } from "@/types";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { endOfMonth, startOfMonth } from "date-fns";
import { ActivityStatusValue } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-status-value";
import { ActivityPriorityValue } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-priority-value";
import _ from "lodash";
import { cn } from "@/lib/utils";
import { StaffSelectItem } from "@/app/[locale]/(backoffice)/admin/_components/staffs-select";

interface StaffSalaryDetailTableProps {
  data: StaffWithSalaryAndActivity[];
}
export const StaffSalariesDetailTable = ({
  data,
}: StaffSalaryDetailTableProps) => {
  const t = useTranslations("salaries");

  const { number, dateTime } = useFormatter();
  const totalSalary = _.sumBy(data, (item) => {
    return item.actualCost;
  });
  const totalHourlyWork = _.sumBy(data, (item) =>
    item.actualWork !== null && item.activity.status === "COMPLETED"
      ? item.actualWork
      : 0
  );
  return (
    <>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center">
        <SearchBar
          placeholder={t("search.detail.placeholder")}
          isPagination={false}
        />
        <DatePickerWithRangeButton
          begin={startOfMonth(new Date())}
          end={endOfMonth(new Date())}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">
              {t("table.detail.thead.staff")}
            </TableHead>
            <TableHead className="min-w-[200px]">
              {t("table.detail.thead.name")}
            </TableHead>
            <TableHead>{t("table.detail.thead.status")}</TableHead>
            <TableHead>{t("table.detail.thead.priority")}</TableHead>
            <TableHead>{t("table.detail.thead.activityDate")}</TableHead>

            <TableHead className="text-right">
              {t("table.detail.thead.hourlyWage")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.detail.thead.actualWork")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.detail.thead.actualCost")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const { status } = item.activity;
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <StaffSelectItem
                    email={item.staff.email}
                    imageUrl={item.staff.imageUrl}
                    name={item.staff.name}
                    role={item.staff.role}
                  />
                </TableCell>
                {status === "COMPLETED" ? (
                  <TableHead>{item.activity.name}</TableHead>
                ) : (
                  <TableCell>{item.activity.name}</TableCell>
                )}
                <TableCell>
                  <ActivityStatusValue value={item.activity.status} />
                </TableCell>
                <TableCell>
                  <ActivityPriorityValue value={item.activity.priority} />
                </TableCell>
                <TableCell className="font-semibold">
                  {dateTime(item.activity.activityDate, "short")}
                </TableCell>

                <TableCell className={cn("text-right font-semibold")}>
                  {item.hourlyWage !== null
                    ? number(item.hourlyWage, "currency")
                    : t("table.detail.trow.hourlyWage")}
                </TableCell>
                <TableCell className={cn("text-right font-semibold")}>
                  {item.actualWork !== null
                    ? number(item.actualWork, "hour")
                    : t("table.detail.trow.actualWork")}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-semibold",
                    status === "COMPLETED" && "text-green-500"
                  )}
                >
                  {number(item.actualCost, "currency")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead colSpan={6}>
              {t("table.detail.tfooter.totalSalary")}
            </TableHead>
            <TableCell className="text-right">
              {number(totalHourlyWork, "hour")}
            </TableCell>
            <TableCell className="text-right">
              {number(totalSalary, "currency")}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {!data.length && (
        <div className="my-4 text-muted-foreground flex justify-center">
          No results.
        </div>
      )}
    </>
  );
};
