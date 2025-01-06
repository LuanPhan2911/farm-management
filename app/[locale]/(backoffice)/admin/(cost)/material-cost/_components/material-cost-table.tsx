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
import { MaterialWithCost } from "@/types";

import { SearchBar } from "@/components/search-bar";

import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { SelectItemContent } from "@/components/form/select-item";
import { MaterialTypeValue } from "../../../(inventory)/materials/_components/material-type-value";
import { UnitWithValue } from "../../../_components/unit-with-value";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { endOfMonth, startOfMonth } from "date-fns";
import _ from "lodash";

interface MaterialCostTableProps {
  data: MaterialWithCost[];
}
export const MaterialCostsTable = ({ data }: MaterialCostTableProps) => {
  const t = useTranslations("materials");
  const { number, dateTime } = useFormatter();
  const router = useRouterWithRole();
  const totalCost = _.sumBy(data, (item) => item.totalCost);
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar isPagination placeholder={t("search.cost.placeholder")} />
        <DatePickerWithRangeButton
          begin={startOfMonth(new Date())}
          end={endOfMonth(new Date())}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">
              {t("table.thead.material")}
            </TableHead>
            <TableHead>{t("table.thead.type")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.basePrice")}
            </TableHead>

            <TableHead className="text-right">
              {t("table.thead.quantityInStock")}
            </TableHead>

            <TableHead className="text-right">
              {t("table.cost.thead.totalQuantityUsed")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.cost.thead.totalCost")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => {
                  router.push(`materials/detail/${item.id}`);
                }}
              >
                <TableCell>
                  <SelectItemContent
                    imageUrl={item.imageUrl}
                    title={item.name}
                    description={
                      item.description || t("table.trow.description")
                    }
                  />
                </TableCell>
                <TableCell>
                  <MaterialTypeValue value={item.type} />
                </TableCell>

                <TableCell className="text-right">
                  {item.basePrice !== null
                    ? number(item.basePrice, "currency")
                    : t("table.trow.basePrice")}
                </TableCell>

                <TableCell className="text-right font-semibold">
                  <UnitWithValue
                    value={item.quantityInStock}
                    unit={item.unit.name}
                  />
                </TableCell>
                <TableCell className="text-right font-semibold">
                  <UnitWithValue
                    value={item.totalQuantityUsed}
                    unit={item.unit.name}
                  />
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {number(item.totalCost, "currency")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead colSpan={5}>{t("table.tfooter.total")}</TableHead>
            <TableCell className="text-right">
              {number(totalCost, "currency")}
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
