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

import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { SearchBar } from "@/components/search-bar";

import { CropStatusValue } from "../../../crops/_components/crop-status-value";
import { CropSaleTable } from "@/types";
import _ from "lodash";
import { endOfMonth, startOfMonth } from "date-fns";

interface CropsSaleTableProps {
  data: CropSaleTable[];
  totalPage: number;
}
export const CropsSaleTable = ({ data, totalPage }: CropsSaleTableProps) => {
  const t = useTranslations("crops");
  const { dateTime, number } = useFormatter();
  const totalRevenue = _.sumBy(data, (item) => item.totalRevenue);
  return (
    <>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center ">
        <SearchBar placeholder={t("search.placeholder")} />
        <DatePickerWithRangeButton
          begin={startOfMonth(new Date())}
          end={endOfMonth(new Date())}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[250px]">
              {t("table.thead.name")}
            </TableHead>
            <TableHead>{t("table.thead.startDate")}</TableHead>
            <TableHead>{t("table.thead.endDate")}</TableHead>

            <TableHead className="text-right">
              {t("table.thead.estimatedYield")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.actualYield")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.remainYield")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.totalRevenue")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow key={item.id} className="cursor-pointer">
                <TableHead className="whitespace-nowrap">{item.name}</TableHead>
                <TableCell className="font-semibold">
                  {dateTime(item.startDate, "long")}
                </TableCell>
                <TableCell className="font-semibold">
                  {item.endDate
                    ? dateTime(item.endDate, "long")
                    : t("table.trow.endDate")}
                </TableCell>

                <TableCell className="text-right">
                  {item.estimatedYield} {item.unit.name}
                </TableCell>
                <TableCell className="text-right">
                  {item.actualYield} {item.unit.name}
                </TableCell>
                <TableCell className="text-right">
                  {item.remainYield} {item.unit.name}
                </TableCell>
                <TableHead className="text-right">
                  {number(item.totalRevenue, "currency")}
                </TableHead>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead colSpan={6}>{t("table.tfooter.total")}</TableHead>
            <TableCell className="text-right">
              {number(totalRevenue, "currency")}
            </TableCell>
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
