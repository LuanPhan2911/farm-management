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
import { StaffWithSalary } from "@/types";
import { StaffSelectItem } from "../../../_components/staffs-select";
import _ from "lodash";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { endOfMonth, startOfMonth } from "date-fns";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

interface StaffSalariesTableProps {
  data: StaffWithSalary[];
}
export const StaffSalariesTable = ({ data }: StaffSalariesTableProps) => {
  const t = useTranslations("salaries");
  const router = useRouterWithRole();
  const { number } = useFormatter();
  const handleEdit = (row: StaffWithSalary) => {
    router.pushDetail(`detail/${row.id}`);
  };

  const totalSalary = _.sumBy(data, (item) => item.salary);
  const totalHourlyWork = _.sumBy(data, (item) => item.hourlyWork);
  return (
    <>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center">
        <SearchBar placeholder={t("search.placeholder")} isPagination={false} />
        <DatePickerWithRangeButton
          begin={startOfMonth(new Date())}
          end={endOfMonth(new Date())}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.thead.staff")}</TableHead>
            <TableHead>{t("table.thead.phone")}</TableHead>
            <TableHead>{t("table.thead.address")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.baseHourlyWage")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead._count.activityAssigned")}
            </TableHead>

            <TableHead className="text-right">
              {t("table.thead.totalHourlyWork")}
            </TableHead>

            <TableHead className="text-right">
              {t("table.thead.salary")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((staff) => {
            return (
              <TableRow
                key={staff.id}
                className="cursor-pointer"
                onClick={() => handleEdit(staff)}
              >
                <TableCell>
                  <StaffSelectItem
                    email={staff.email}
                    imageUrl={staff.imageUrl}
                    name={staff.name}
                    role={staff.role}
                  />
                </TableCell>
                <TableCell>{staff.phone || t("table.trow.phone")}</TableCell>
                <TableCell>
                  {staff.address || t("table.trow.address")}
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {staff.baseHourlyWage
                    ? number(staff.baseHourlyWage, "currency")
                    : t("table.trow.baseHourlyWage")}
                </TableCell>
                <TableCell className="text-right">
                  {staff._count.activityAssigned}
                </TableCell>

                <TableCell className="text-right font-semibold">
                  {number(staff.hourlyWork, "hour")}
                </TableCell>

                <TableCell className="text-right font-semibold">
                  {number(staff.salary, "currency")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead colSpan={5}>{t("table.tfooter.total")}</TableHead>
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
