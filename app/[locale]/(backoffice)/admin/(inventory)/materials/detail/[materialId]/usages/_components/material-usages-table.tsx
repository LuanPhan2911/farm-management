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
import { MaterialUsageTable } from "@/types";

import { OrderByButton } from "@/components/buttons/order-by-button";

import { SearchBar } from "@/components/search-bar";
import { MaterialUsagesTableAction } from "./material-usages-table-action";
import { useDialog } from "@/stores/use-dialog";
import { UserAvatar } from "@/components/user-avatar";
import { MaterialTypeValue } from "../../../../_components/material-type-value";
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { UsageStatusValue } from "@/components/usage-status-value";
import { SelectItemContent } from "@/components/form/select-item";

interface MaterialUsagesTableProps {
  data: MaterialUsageTable[];
  totalPage: number;
}
export const MaterialUsagesTable = ({
  data,
  totalPage,
}: MaterialUsagesTableProps) => {
  const { onOpen } = useDialog();
  const t = useTranslations("materialUsages");
  const { dateTime } = useFormatter();
  const { number } = useFormatter();
  const handleEdit = (row: MaterialUsageTable) => {
    onOpen("materialUsage.edit", { materialUsage: row });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar
          isPagination={totalPage > 1}
          placeholder={t("search.placeholder")}
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <OrderByButton
                column="material.name"
                label={t("table.thead.material.name")}
              />
            </TableHead>
            <TableHead>{t("table.thead.activity.usage")}</TableHead>

            <TableHead>{t("table.thead.material.type")}</TableHead>
            <TableHead>{t("table.thead.createdAt")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.material.quantityInStock")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.quantityUsed")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.actualPrice")}
            </TableHead>

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
                    value={item.material.quantityInStock}
                    unit={item.unit.name}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <UnitWithValue
                    value={item.quantityUsed}
                    unit={item.unit.name}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {item.actualPrice
                    ? number(item.actualPrice, "currency")
                    : t("table.trow.actualPrice")}
                </TableCell>

                <TableCell>
                  <MaterialUsagesTableAction data={item} />
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
