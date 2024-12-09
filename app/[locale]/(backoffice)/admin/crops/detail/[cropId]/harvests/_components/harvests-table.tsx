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
import { HarvestTable, ManagePermission } from "@/types";

import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { endOfMonth, startOfMonth } from "date-fns";
import { StaffSelectItem } from "@/app/[locale]/(backoffice)/admin/_components/staffs-select";
import { HarvestsTableAction } from "./harvests-table-action";

interface HarvestsTableProps extends ManagePermission {
  data: HarvestTable[];
  totalPage: number;
}
export const HarvestsTable = ({
  data,
  totalPage,
  canDelete,
}: HarvestsTableProps) => {
  const t = useTranslations("harvests");
  const { dateTime } = useFormatter();
  return (
    <>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center ">
        <DatePickerWithRangeButton
          begin={startOfMonth(new Date())}
          end={endOfMonth(new Date())}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.thead.harvestDate")}</TableHead>
            <TableHead>{t("table.thead.createdById")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.value")}
            </TableHead>
            <TableHead>{t("table.thead.unitId")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.id} className="cursor-pointer">
                <TableCell>{dateTime(item.harvestDate, "long")}</TableCell>
                <TableCell>
                  <StaffSelectItem
                    email={item.createdBy.email}
                    imageUrl={item.createdBy.imageUrl}
                    name={item.createdBy.name}
                    role={item.createdBy.role}
                  />
                </TableCell>
                <TableCell className="text-right">{item.value}</TableCell>
                <TableCell>{item.unit.name}</TableCell>
                <TableCell>
                  <HarvestsTableAction
                    data={item}
                    disabled={!canDelete}
                    canDelete={canDelete}
                  />
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
