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
import { useTranslations } from "next-intl";
import { MaterialUsageTable } from "@/types";

import { OrderByButton } from "@/components/buttons/order-by-button";

import { SearchBar } from "@/components/search-bar";
import { MaterialUsagesTableAction } from "./material-usages-table-action";
import { useDialog } from "@/stores/use-dialog";
import { UserAvatar } from "@/components/user-avatar";
import { MaterialTypeValue } from "../../../../_components/material-type-value";
import { ActivityStatusValue } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-status-value";

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
            <TableHead>{t("table.thead.material.imageUrl")}</TableHead>
            <TableHead className="lg:w-[200px]">
              <OrderByButton
                column="material.name"
                label={t("table.thead.material.name")}
              />
            </TableHead>
            <TableHead>{t("table.thead.material.type")}</TableHead>
            <TableHead className="lg:w-[200px]">
              {t("table.thead.activity.name")}
            </TableHead>
            <TableHead>{t("table.thead.activity.status")}</TableHead>

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
                <TableCell>
                  <UserAvatar src={item.material.imageUrl || undefined} />
                </TableCell>
                <TableCell>{item.material.name}</TableCell>
                <TableCell>
                  <MaterialTypeValue value={item.material.type} />
                </TableCell>
                <TableCell>
                  {item.activity?.name || t("table.trow.activity.name")}
                </TableCell>
                <TableCell>
                  {item.activity?.status ? (
                    <ActivityStatusValue value={item.activity.status} />
                  ) : (
                    t("table.trow.activity.status")
                  )}
                </TableCell>

                <TableCell className="text-center">
                  {item.material.quantityInStock}
                </TableCell>
                <TableCell className="text-center">
                  {item.quantityUsed}
                </TableCell>
                <TableCell>{item.unit.name}</TableCell>
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
