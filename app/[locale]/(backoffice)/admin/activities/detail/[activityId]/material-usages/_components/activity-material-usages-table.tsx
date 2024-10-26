"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { MaterialUsageTable } from "@/types";

import { OrderByButton } from "@/components/buttons/order-by-button";

import { SearchBar } from "@/components/search-bar";

import { useDialog } from "@/stores/use-dialog";
import { UserAvatar } from "@/components/user-avatar";

import { ActivityStatusValue } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-status-value";
import { MaterialTypeValue } from "@/app/[locale]/(backoffice)/admin/(inventory)/materials/_components/material-type-value";
import { ActivityMaterialUsagesTableAction } from "./activity-material-usages-table-action";

interface ActivityMaterialUsagesTableProps {
  data: MaterialUsageTable[];
}
export const ActivityMaterialUsagesTable = ({
  data,
}: ActivityMaterialUsagesTableProps) => {
  const { onOpen } = useDialog();
  const t = useTranslations("materialUsages");
  const handleEdit = (row: MaterialUsageTable) => {
    onOpen("materialUsage.edit", { materialUsage: row });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.thead.activity.usage")}</TableHead>
            <TableHead>{t("table.thead.material.imageUrl")}</TableHead>
            <TableHead className="lg:w-[200px]">
              <OrderByButton
                column="material.name"
                label={t("table.thead.material.name")}
              />
            </TableHead>
            <TableHead>{t("table.thead.material.type")}</TableHead>

            <TableHead className="lg:w-[200px]">
              {t("table.thead.material.quantityInStock")}
            </TableHead>
            <TableHead className="lg:w-[200px]">
              <OrderByButton
                column="quantityUsed"
                label={t("table.thead.quantityUsed")}
              />
            </TableHead>
            <TableHead>{t("table.thead.unitId")}</TableHead>
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
                  {item.activity ? (
                    <span className="text-green-400">
                      {t("table.trow.activity.usage")}
                    </span>
                  ) : (
                    t("table.trow.activity.unused")
                  )}
                </TableCell>

                <TableCell>
                  <UserAvatar src={item.material.imageUrl || undefined} />
                </TableCell>
                <TableCell>{item.material.name}</TableCell>
                <TableCell>
                  <MaterialTypeValue value={item.material.type} />
                </TableCell>

                <TableCell className="text-center">
                  {item.material.quantityInStock}
                </TableCell>
                <TableCell className="text-center">
                  {item.quantityUsed}
                </TableCell>
                <TableCell>{item.unit.name}</TableCell>
                <TableCell>
                  <ActivityMaterialUsagesTableAction data={item} />
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
    </>
  );
};
