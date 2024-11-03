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
import { MaterialTable } from "@/types";
import { MaterialsTableAction } from "./materials-table-action";

import { OrderByButton } from "@/components/buttons/order-by-button";

import { SearchBar } from "@/components/search-bar";
import { UserAvatar } from "@/components/user-avatar";
import { MaterialsTableFaceted } from "./materials-table-faceted";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

interface MaterialsTableProps {
  data: MaterialTable[];
  totalPage: number;
}
export const MaterialsTable = ({ data, totalPage }: MaterialsTableProps) => {
  const router = useRouterWithRole();

  const t = useTranslations("materials");
  const handleViewDetail = (row: MaterialTable) => {
    router.push(`materials/detail/${row.id}`);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
        <MaterialsTableFaceted />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.thead.imageUrl")}</TableHead>
            <TableHead className="lg:w-[200px]">
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>
              <OrderByButton column="type" label={t("table.thead.type")} />
            </TableHead>
            <TableHead>
              <OrderByButton
                column="quantityInStock"
                label={t("table.thead.quantityInStock")}
              />
            </TableHead>
            <TableHead>{t("table.thead.unitId")}</TableHead>
            <TableHead>{t("table.thead.countUsages")}</TableHead>

            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() => handleViewDetail(item)}
              >
                <TableCell>
                  <UserAvatar
                    src={item.imageUrl || undefined}
                    size={"default"}
                  />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{t(`schema.type.options.${item.type}`)}</TableCell>

                <TableCell className="text-center">
                  {item.quantityInStock}
                </TableCell>
                <TableCell>{item.unit.name}</TableCell>
                <TableCell className="text-center">
                  {item._count.materialUsages}
                </TableCell>
                <TableCell>
                  <MaterialsTableAction data={item} />
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
