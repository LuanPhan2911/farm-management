"use client";

import { NavPagination } from "@/components/nav-pagination";

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
import { ManagePermission, SaleTableWithCost } from "@/types";

import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { endOfMonth, startOfMonth } from "date-fns";
import { StaffSelectItem } from "@/app/[locale]/(backoffice)/admin/_components/staffs-select";
import { SalesTableAction } from "./sales-table-action";
import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { SearchBar } from "@/components/search-bar";
import _ from "lodash";

interface SalesTableProps extends ManagePermission {
  data: SaleTableWithCost[];
  totalPage: number;
}
export const SalesTable = ({ data, totalPage, canDelete }: SalesTableProps) => {
  const t = useTranslations("sales");
  const { dateTime } = useFormatter();
  const totalCost = _.sumBy(data, (item) => item.actualCost);
  const { number } = useFormatter();
  return (
    <>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center ">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
        <DatePickerWithRangeButton
          begin={startOfMonth(new Date())}
          end={endOfMonth(new Date())}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.thead.saleDate")}</TableHead>
            <TableHead>{t("table.thead.customerName")}</TableHead>
            <TableHead>{t("table.thead.customerAddress")}</TableHead>
            <TableHead>{t("table.thead.customerPhone")}</TableHead>
            <TableHead>{t("table.thead.createdById")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.value")}
            </TableHead>

            <TableHead className="text-right">
              {t("table.thead.price")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.actualCost")}
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.id} className="cursor-pointer">
                <TableCell>{dateTime(item.saleDate, "long")}</TableCell>
                <TableCell>
                  <SelectItemContentWithoutImage
                    title={item.customerName}
                    description={item.customerEmail}
                  />
                </TableCell>
                <TableCell>{item.customerAddress}</TableCell>
                <TableCell>{item.customerPhone}</TableCell>
                <TableCell>
                  <StaffSelectItem
                    email={item.createdBy.email}
                    imageUrl={item.createdBy.imageUrl}
                    name={item.createdBy.name}
                    role={item.createdBy.role}
                  />
                </TableCell>
                <TableHead className="text-right">
                  {item.value} {item.unit.name}
                </TableHead>

                <TableHead className="text-right">
                  {number(item.price, "currency")} / {item.unit.name}
                </TableHead>
                <TableHead className="text-right">
                  {number(item.actualCost, "currency")}
                </TableHead>
                <TableCell>
                  <SalesTableAction
                    data={item}
                    canDelete={canDelete}
                    disabled={!canDelete}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead colSpan={7}>{t("table.tfooter.total")}</TableHead>
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
      <div className="py-4">
        <NavPagination totalPage={totalPage} />
      </div>
    </>
  );
};
