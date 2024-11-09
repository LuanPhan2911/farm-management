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
import { EquipmentTable } from "@/types";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { EquipmentsTableFaceted } from "./equipments-table-faceted";
import { SearchBar } from "@/components/search-bar";
import { useSearchParams } from "next/navigation";
import { includeString } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { UnitWithValue } from "../../../_components/unit-with-value";

interface EquipmentsTableProps {
  data: EquipmentTable[];
  totalPage: number;
}
export const EquipmentsTable = ({ data, totalPage }: EquipmentsTableProps) => {
  const searchParams = useSearchParams();
  const router = useRouterWithRole();
  const query = searchParams!.get("query");

  if (query) {
    data = data.filter((item) => includeString(item.name, query));
  }
  const t = useTranslations("equipments");
  const { dateTime } = useFormatter();
  const handleViewDetail = (row: EquipmentTable) => {
    router.push(`equipments/detail/${row.id}`);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
        <EquipmentsTableFaceted />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.thead.imageUrl")}</TableHead>
            <TableHead>
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>{t("table.thead.type")}</TableHead>
            <TableHead>{t("table.thead.brand")}</TableHead>
            <TableHead>{t("table.thead.purchaseDate")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.purchasePrice")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.countDetail")}
            </TableHead>
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
                  <UserAvatar src={item.imageUrl || undefined} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{t(`schema.type.options.${item.type}`)}</TableCell>

                <TableCell>{item.brand}</TableCell>
                <TableCell>
                  {item.purchaseDate
                    ? dateTime(item.purchaseDate, "long")
                    : t("table.trow.purchaseDate")}
                </TableCell>
                <TableCell>
                  {item.purchasePrice?.value ? (
                    <UnitWithValue
                      value={item.purchasePrice.value}
                      unit={item.purchasePrice.unit?.name}
                    />
                  ) : (
                    <p className="text-right">
                      {t("table.trow.purchasePrice")}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {item._count.equipmentDetails}
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
