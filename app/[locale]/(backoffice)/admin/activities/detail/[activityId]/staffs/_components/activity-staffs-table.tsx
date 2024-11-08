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
import { UserAvatar } from "@/components/user-avatar";
import { useFormatter, useTranslations } from "next-intl";
import { StaffMetadataRole } from "@/app/[locale]/(backoffice)/admin/_components/staff-metadata-role";
import { ActivityStaffsTableAction } from "./activity-staffs-table-action";
import { ActivityAssignedStaffWithActivitySelect } from "@/types";
import { useDialog } from "@/stores/use-dialog";

interface ActivityStaffsTableProps {
  data: ActivityAssignedStaffWithActivitySelect[];
  totalCost: number;
}
export const ActivityStaffsTable = ({
  data,
  totalCost,
}: ActivityStaffsTableProps) => {
  const t = useTranslations("activityAssigned");
  const { relativeTime, number } = useFormatter();
  const { onOpen } = useDialog();
  const handleEdit = (row: ActivityAssignedStaffWithActivitySelect) => {
    onOpen("activityAssigned.edit", {
      activityAssigned: row,
    });
  };
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{t("table.thead.name")}</TableHead>
            <TableHead>{t("table.thead.email")}</TableHead>
            <TableHead>{t("table.thead.role")}</TableHead>
            <TableHead>{t("table.thead.assignedAt")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.baseHourlyWage")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.actualWork")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.hourlyWage")}
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
                  <UserAvatar
                    src={staff.imageUrl || undefined}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>{staff.name}</TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>
                  <StaffMetadataRole
                    metadata={{
                      role: staff.role,
                    }}
                  />
                </TableCell>
                <TableCell>{relativeTime(assignedAt)}</TableCell>
                <TableCell className="text-right">
                  {staff.baseHourlyWage
                    ? number(staff.baseHourlyWage, "hour")
                    : t("table.trow.baseHourlyWage")}
                </TableCell>
                <TableCell className="text-right">
                  {actualWork
                    ? number(actualWork, "hour")
                    : t("table.trow.actualWork")}
                </TableCell>
                <TableCell className="text-right">
                  {hourlyWage
                    ? number(hourlyWage, "currency")
                    : t("table.trow.hourlyWage")}
                </TableCell>
                <TableCell className="text-right">
                  {actualCost
                    ? number(actualCost, "currency")
                    : t("table.trow.actualCost")}
                </TableCell>

                <TableCell>
                  <ActivityStaffsTableAction data={item} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>{t("table.tfooter.total")}</TableCell>
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
