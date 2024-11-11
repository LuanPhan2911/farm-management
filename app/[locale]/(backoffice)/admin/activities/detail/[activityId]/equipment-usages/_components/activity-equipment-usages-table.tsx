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
import { EquipmentUsageTable, EquipmentUsageTableWithCost } from "@/types";

import { OrderByButton } from "@/components/buttons/order-by-button";

import { SearchBar } from "@/components/search-bar";

import { useDialog } from "@/stores/use-dialog";
import { UsageStatusValue } from "@/components/usage-status-value";
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { EquipmentDetailStatusValue } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/_components/equipment-detail-status-value";
import { EquipmentUsagesTableAction } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/details/[equipmentDetailId]/usages/_components/equipment-usages-table-action";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

interface ActivityEquipmentUsagesTableProps {
  data: EquipmentUsageTableWithCost[];
  totalCost: number;
  disabled?: boolean;
}
export const ActivityEquipmentUsagesTable = ({
  data,
  totalCost,
  disabled,
}: ActivityEquipmentUsagesTableProps) => {
  const { onOpen } = useDialog();
  const t = useTranslations("equipmentUsages");
  const { dateTime, number } = useFormatter();
  const { push } = useRouterWithRole();
  const { isFarmer } = useCurrentStaffRole();
  const handleEdit = (row: EquipmentUsageTable) => {
    if (isFarmer) {
      push(`equipments/detail/${row.equipmentDetail.equipmentId}/details`);
    }
    if (!disabled) {
      onOpen("equipmentUsage.edit", { equipmentUsage: row });
    }
  };
  const isHidden = isFarmer;
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar placeholder={t("search.placeholder")} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.thead.activity.usage")}</TableHead>

            <TableHead>{t("table.thead.equipmentDetail.name")}</TableHead>
            <TableHead>{t("table.thead.equipmentDetail.status")}</TableHead>

            <TableHead>
              <OrderByButton
                column="usageStartTime"
                label={t("table.thead.usageStartTime")}
              />
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.duration")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.fuelConsumption")}
            </TableHead>
            {!isHidden && (
              <>
                <TableHead className="text-right">
                  {t("table.thead.fuelPrice")}
                </TableHead>
                <TableHead className="text-right">
                  {t("table.thead.rentalPrice")}
                </TableHead>
                <TableHead className="text-right">
                  {t("table.thead.actualCost")}
                </TableHead>
              </>
            )}

            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => handleEdit(item)}
              >
                <TableCell className="font-semibold">
                  <UsageStatusValue status={!!item.activity} />
                </TableCell>

                <TableCell>{item.equipmentDetail.name}</TableCell>
                <TableCell>
                  <EquipmentDetailStatusValue
                    status={item.equipmentDetail.status}
                  />
                </TableCell>

                <TableCell>{dateTime(item.usageStartTime, "long")}</TableCell>
                <TableCell className="text-right">
                  {number(item.duration, "hour")}
                </TableCell>
                <TableCell className="text-right">
                  {item.fuelConsumption ? (
                    <UnitWithValue
                      value={item.fuelConsumption}
                      unit={item.unit?.name}
                    />
                  ) : (
                    t("table.trow.fuelConsumption")
                  )}
                </TableCell>
                {!isHidden && (
                  <>
                    <TableCell className="text-right">
                      {item.fuelPrice
                        ? number(item.fuelPrice, "currency")
                        : t("table.trow.fuelPrice")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.rentalPrice
                        ? number(item.rentalPrice, "currency")
                        : t("table.trow.rentalPrice")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.actualCost
                        ? number(item.actualCost, "currency")
                        : t("table.trow.actualCost")}
                    </TableCell>
                  </>
                )}

                <TableCell>
                  <EquipmentUsagesTableAction data={item} disabled={disabled} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {!isHidden && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>{t("table.tfooter.totalCost")}</TableCell>
              <TableCell className="text-right">
                {number(totalCost, "currency")}
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
      {!data.length && (
        <div className="my-4 text-muted-foreground flex justify-center">
          No results.
        </div>
      )}
    </>
  );
};
