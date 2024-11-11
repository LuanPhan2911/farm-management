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
import { SearchBar } from "@/components/search-bar";
import { NavPagination } from "@/components/nav-pagination";
import { StaffMetadataRole } from "../../../_components/staff-metadata-role";
import { StaffsTableAction } from "./staffs-table-action";
import { Staff } from "@prisma/client";
import { OrderByButton } from "@/components/buttons/order-by-button";
import { useDialog } from "@/stores/use-dialog";
import { useCurrentStaff } from "@/hooks/use-current-staff";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface StaffsTableProps {
  data: Staff[];
  totalPage: number;
}
export const StaffsTable = ({ data, totalPage }: StaffsTableProps) => {
  const t = useTranslations("staffs");
  const { relativeTime } = useFormatter();
  const { onOpen } = useDialog();
  const { currentStaff } = useCurrentStaff();
  const { isSuperAdmin } = useCurrentStaffRole();
  const { number } = useFormatter();
  const handleEdit = (row: Staff) => {
    const isOwner = currentStaff?.id === row.id;
    const canEdit = isSuperAdmin || isOwner;
    if (!canEdit) {
      return;
    }

    onOpen("staff.edit", { staff: row });
  };
  return (
    <>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center">
        <SearchBar placeholder={t("search.placeholder")} isPagination />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>
              <OrderByButton column="email" label={t("table.thead.email")} />
            </TableHead>
            <TableHead>{t("table.thead.role")}</TableHead>
            <TableHead>{t("table.thead.phone")}</TableHead>
            <TableHead>{t("table.thead.address")}</TableHead>
            <TableHead>
              <OrderByButton
                column="createdAt"
                label={t("table.thead.createdAt")}
              />
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.baseHourlyWage")}
            </TableHead>

            <TableHead></TableHead>
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
                  <UserAvatar src={staff.imageUrl || undefined} />
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
                <TableCell>{staff.phone || t("table.trow.phone")}</TableCell>
                <TableCell>
                  {staff.address || t("table.trow.address")}
                </TableCell>
                <TableCell>{relativeTime(staff.createdAt)}</TableCell>
                <TableCell className="text-right">
                  {staff.baseHourlyWage
                    ? number(staff.baseHourlyWage, "currency")
                    : t("table.trow.baseHourlyWage")}
                </TableCell>

                <TableCell>
                  <StaffsTableAction data={staff} />
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
      <div className="py-4">
        <NavPagination totalPage={totalPage} />
      </div>
    </>
  );
};
