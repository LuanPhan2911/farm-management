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
import { ActivityStaffsTableAction } from "./activity-staffs-table-action";
import { StaffWithSalaryAndActivity } from "@/types";
import { useDialog } from "@/stores/use-dialog";
import { StaffSelectItem } from "@/app/[locale]/(backoffice)/admin/_components/staffs-select";
import _ from "lodash";

interface ActivityStaffsTableProps {
  data: StaffWithSalaryAndActivity[];
  disabled?: boolean;
}
export const ActivityStaffsTable = ({
  data,
  disabled,
}: ActivityStaffsTableProps) => {
  const t = useTranslations("activityAssigned");
  const { relativeTime, number } = useFormatter();
  const { onOpen } = useDialog();
  const totalCost = _.sumBy(data, (item) => item.actualCost);
  const handleEdit = (row: StaffWithSalaryAndActivity) => {
    if (disabled) {
      return;
    }
    onOpen("activityAssigned.edit", {
      activityAssigned: row,
    });
  };
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.thead.name")}</TableHead>
            <TableHead>{t("table.thead.assignedAt")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.baseHourlyWage")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.hourlyWage")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.actualWork")}
            </TableHead>

            <TableHead className="text-right">
              {t("table.thead.actualCost")}
            </TableHead>

            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const { staff, actualWork, hourlyWage, assignedAt, actualCost } =
              item;
            return (
              <TableRow
                key={staff.id}
                className="cursor-pointer"
                onClick={() => handleEdit(item)}
              >
                <TableCell>
                  <StaffSelectItem
                    role={staff.role}
                    imageUrl={staff.imageUrl}
                    name={staff.name}
                    email={staff.email}
                  />
                </TableCell>

                <TableCell>{relativeTime(assignedAt)}</TableCell>
                <TableCell className="text-right">
                  {staff.baseHourlyWage
                    ? number(staff.baseHourlyWage, "currency")
                    : t("table.trow.baseHourlyWage")}
                </TableCell>
                <TableCell className="text-right">
                  {hourlyWage
                    ? number(hourlyWage, "currency")
                    : t("table.trow.hourlyWage")}
                </TableCell>
                <TableCell className="text-right">
                  {actualWork
                    ? number(actualWork, "hour")
                    : t("table.trow.actualWork")}
                </TableCell>

                <TableCell className="text-right">
                  {actualCost
                    ? number(actualCost, "currency")
                    : t("table.trow.actualCost")}
                </TableCell>

                <TableCell>
                  <ActivityStaffsTableAction data={item} disabled={disabled} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>{t("table.tfooter.total")}</TableCell>
            <TableCell className="text-right">
              {number(totalCost, "currency")}
            </TableCell>
            <TableCell></TableCell>
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
