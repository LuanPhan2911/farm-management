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
import { MaterialUsageTable, MaterialUsageTableWithCost } from "@/types";
import { OrderByButton } from "@/components/buttons/order-by-button";
import { SearchBar } from "@/components/search-bar";
import { useDialog } from "@/stores/use-dialog";

import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { UsageStatusValue } from "@/components/usage-status-value";
import { UserAvatar } from "@/components/user-avatar";
import { MaterialTypeValue } from "@/app/[locale]/(backoffice)/admin/(inventory)/materials/_components/material-type-value";
import { MaterialUsagesTableAction } from "@/app/[locale]/(backoffice)/admin/(inventory)/materials/detail/[materialId]/usages/_components/material-usages-table-action";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

interface ActivityMaterialUsagesTableProps {
  data: MaterialUsageTableWithCost[];
  totalCost: number;
  disabled?: boolean;
}
export const ActivityMaterialUsagesTable = ({
  data,
  totalCost,
  disabled,
}: ActivityMaterialUsagesTableProps) => {
  const { onOpen } = useDialog();
  const t = useTranslations("materialUsages");
  const { dateTime } = useFormatter();
  const { number } = useFormatter();
  const { isFarmer } = useCurrentStaffRole();
  const { push } = useRouterWithRole();
  const handleEdit = (row: MaterialUsageTable) => {
    if (isFarmer) {
      push(`materials/detail/${row.materialId}`);
    }
    if (!disabled) {
      onOpen("materialUsage.edit", { materialUsage: row });
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
            <TableHead>{t("table.thead.createdAt")}</TableHead>
            <TableHead>{t("table.thead.material.imageUrl")}</TableHead>
            <TableHead className="w-[200px]">
              <OrderByButton
                column="material.name"
                label={t("table.thead.material.name")}
              />
            </TableHead>
            <TableHead>{t("table.thead.material.type")}</TableHead>

            <TableHead className="text-right">
              {t("table.thead.quantityUsed")}
            </TableHead>
            {!isHidden && (
              <>
                <TableHead className="text-right">
                  {t("table.thead.actualPrice")}
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
                <TableCell>
                  <UsageStatusValue status={!!item.activityId} />
                </TableCell>
                <TableCell>{dateTime(item.createdAt, "long")}</TableCell>
                <TableCell>
                  <UserAvatar src={item.material.imageUrl || undefined} />
                </TableCell>
                <TableCell>{item.material.name}</TableCell>
                <TableCell>
                  <MaterialTypeValue value={item.material.type} />
                </TableCell>

                <TableCell className="text-right">
                  <UnitWithValue
                    value={item.quantityUsed}
                    unit={item.unit.name}
                  />
                </TableCell>
                {!isHidden && (
                  <>
                    <TableCell className="text-right">
                      {item.actualPrice
                        ? number(item.actualPrice, "currency")
                        : t("table.trow.actualPrice")}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.actualCost
                        ? number(item.actualCost, "currency")
                        : t("table.trow.actualCost")}
                    </TableCell>
                  </>
                )}

                <TableCell>
                  <MaterialUsagesTableAction data={item} disabled={disabled} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {!isHidden && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>{t("table.tfooter.totalCost")}</TableCell>
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
