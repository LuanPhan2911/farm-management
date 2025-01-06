"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { SelectItemContent } from "@/components/form/select-item";

interface StaffsTableProps {
  data: Staff[];
  totalPage: number;
}
export const StaffsTable = ({ data, totalPage }: StaffsTableProps) => {
  const t = useTranslations("staffs");
  const { dateTime } = useFormatter();
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
            <TableHead>
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>{t("table.thead.role")}</TableHead>
            <TableHead>{t("table.thead.phone")}</TableHead>
            <TableHead>{t("table.thead.address")}</TableHead>
            <TableHead>{t("table.thead.startToWorkDate")}</TableHead>
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
                  <SelectItemContent
                    description={staff.email}
                    imageUrl={staff.imageUrl}
                    title={staff.name}
                  />
                </TableCell>
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
                <TableCell>{dateTime(staff.startToWorkDate)}</TableCell>
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
