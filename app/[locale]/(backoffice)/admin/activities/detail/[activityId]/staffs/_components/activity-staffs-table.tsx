"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/user-avatar";
import { useFormatter, useTranslations } from "next-intl";
import { Staff } from "@prisma/client";
import { StaffMetadataRole } from "@/app/[locale]/(backoffice)/admin/_components/staff-metadata-role";
import { ActivityStaffsTableAction } from "./activity-staffs-table-action";

interface ActivityStaffsTableProps {
  data: Staff[];
}
export const ActivityStaffsTable = ({ data }: ActivityStaffsTableProps) => {
  const t = useTranslations("staffs");
  const { relativeTime } = useFormatter();

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{t("table.thead.name")}</TableHead>
            <TableHead>{t("table.thead.email")}</TableHead>
            <TableHead>{t("table.thead.role")}</TableHead>
            <TableHead>{t("table.thead.createdAt")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((staff) => {
            return (
              <TableRow key={staff.id} className="cursor-pointer">
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
                <TableCell>{relativeTime(staff.createdAt)}</TableCell>
                <TableCell>
                  <ActivityStaffsTableAction data={staff} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!data.length && (
        <div className="my-4 text-muted-foreground flex justify-center">
          No results.
        </div>
      )}
    </>
  );
};
