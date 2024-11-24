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
import { EquipmentDetailUsageCost } from "@/types";

import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { SelectItemContent } from "@/components/form/select-item";
import { DatePickerWithRangeButton } from "@/components/buttons/date-picker-range-button";
import { endOfMonth, startOfMonth } from "date-fns";
import _ from "lodash";
import { UnitWithValue } from "../../../_components/unit-with-value";

interface EquipmentDetailUsageCostTableProps {
  data: EquipmentDetailUsageCost[];
}
export const EquipmentDetailUsageCostTable = ({
  data,
}: EquipmentDetailUsageCostTableProps) => {
  const t = useTranslations("equipmentDetails");
  const { number, dateTime } = useFormatter();
  const router = useRouterWithRole();
  const totalCost = _.sumBy(data, (item) => item.totalCost);
  const totalRentalPrice = _.sumBy(data, (item) => item.totalRentalPrice);
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <DatePickerWithRangeButton
          begin={startOfMonth(new Date())}
          end={endOfMonth(new Date())}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">
              {t("table.thead.name")}
            </TableHead>

            <TableHead>{t("table.thead.energyType")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.baseFuelPrice")}
            </TableHead>

            <TableHead className="text-right">
              {t("table.cost.thead.totalFuelConsumption")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.cost.thead.totalRentalPrice")}
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
                  router.push(
                    `equipments/detail/${item.equipmentId}/details/${item.id}`
                  );
                }}
              >
                <TableCell>
                  <SelectItemContent
                    imageUrl={item.equipment.imageUrl}
                    title={item.name || item.equipment.name}
                    description={item.location || t("table.trow.location")}
                  />
                </TableCell>

                <TableCell>
                  {item.energyType || t("table.trow.energyType")}
                </TableCell>
                <TableCell className="text-right">
                  {item.baseFuelPrice
                    ? number(item.baseFuelPrice, "currency")
                    : t("table.trow.baseFuelPrice")}
                </TableCell>

                <TableCell className="text-right font-semibold">
                  <UnitWithValue
                    value={item.totalFuelConsumption}
                    unit={item.unit?.name}
                  />
                </TableCell>

                <TableCell className="text-right font-semibold">
                  {number(item.totalRentalPrice, "currency")}
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
            <TableHead colSpan={4}>{t("table.tfooter.total")}</TableHead>
            <TableCell className="text-right">
              {number(totalRentalPrice, "currency")}
            </TableCell>
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
