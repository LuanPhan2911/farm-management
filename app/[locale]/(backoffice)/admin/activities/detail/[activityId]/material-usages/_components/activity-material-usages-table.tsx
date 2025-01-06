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
import {
  ManagePermission,
  MaterialUsageTable,
  MaterialUsageTableWithCost,
} from "@/types";
import { OrderByButton } from "@/components/buttons/order-by-button";
import { SearchBar } from "@/components/search-bar";

import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { UsageStatusValue } from "@/components/usage-status-value";
import { MaterialTypeValue } from "@/app/[locale]/(backoffice)/admin/(inventory)/materials/_components/material-type-value";
import { MaterialUsagesTableAction } from "@/app/[locale]/(backoffice)/admin/(inventory)/materials/detail/[materialId]/usages/_components/material-usages-table-action";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { SelectItemContent } from "@/components/form/select-item";
import _ from "lodash";

interface ActivityMaterialUsagesTableProps extends ManagePermission {
  data: MaterialUsageTableWithCost[];
}
export const ActivityMaterialUsagesTable = ({
  data,
  canEdit,
}: ActivityMaterialUsagesTableProps) => {
  const t = useTranslations("materialUsages");
  const { dateTime } = useFormatter();
  const { number } = useFormatter();
  const { isFarmer: isHidden } = useCurrentStaffRole();
  const { push } = useRouterWithRole();

  const totalCost = _.sumBy(data, (item) => item.actualCost);
  const handleEdit = (row: MaterialUsageTable) => {
    push(`materials/detail/${row.materialId}`);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar placeholder={t("search.placeholder")} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <OrderByButton
                column="material.name"
                label={t("table.thead.material.name")}
              />
            </TableHead>
            <TableHead>{t("table.thead.activity.usage")}</TableHead>
            <TableHead>{t("table.thead.material.type")}</TableHead>
            <TableHead>{t("table.thead.createdAt")}</TableHead>

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
                  <SelectItemContent
                    imageUrl={item.material.imageUrl}
                    title={item.material.name}
                  />
                </TableCell>
                <TableCell>
                  <UsageStatusValue status={!!item.activityId} />
                </TableCell>
                <TableCell>
                  <MaterialTypeValue value={item.material.type} />
                </TableCell>
                <TableCell>{dateTime(item.createdAt, "long")}</TableCell>

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
                  <MaterialUsagesTableAction data={item} canEdit={canEdit} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        {!isHidden && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={6}>{t("table.tfooter.totalCost")}</TableCell>
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
