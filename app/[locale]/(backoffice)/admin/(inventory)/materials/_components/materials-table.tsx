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
import { MaterialTable } from "@/types";

import { OrderByButton } from "@/components/buttons/order-by-button";

import { SearchBar } from "@/components/search-bar";
import { MaterialsTableFaceted } from "./materials-table-faceted";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { MaterialTypeValue } from "./material-type-value";
import { SelectItemContent } from "@/components/form/select-item";

interface MaterialsTableProps {
  data: MaterialTable[];
  totalPage: number;
}
export const MaterialsTable = ({ data, totalPage }: MaterialsTableProps) => {
  const router = useRouterWithRole();

  const t = useTranslations("materials");
  const { number } = useFormatter();
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
            <TableHead className="min-w-[200px]">
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>{t("table.thead.type")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.basePrice")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.quantityInStock")}
            </TableHead>
            <TableHead>{t("table.thead.unitId")}</TableHead>
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
                  <SelectItemContent
                    imageUrl={item.imageUrl}
                    title={item.name}
                  />
                </TableCell>
                <TableCell>
                  <MaterialTypeValue value={item.type} />
                </TableCell>
                <TableCell className="text-right">
                  {item.basePrice
                    ? number(item.basePrice, "currency")
                    : t("table.trow.basePrice")}
                </TableCell>
                <TableCell className="text-right">
                  {item.quantityInStock}
                </TableCell>
                <TableCell>{item.unit.name}</TableCell>
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
