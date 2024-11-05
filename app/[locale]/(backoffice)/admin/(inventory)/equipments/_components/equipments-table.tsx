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
import { EquipmentTable } from "@/types";
import { EquipmentsTableAction } from "./equipments-table-action";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { EquipmentsTableFaceted } from "./equipments-table-faceted";
import { SearchBar } from "@/components/search-bar";
import { useSearchParams } from "next/navigation";
import { includeString } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

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
            <TableHead>
              <OrderByButton column="type" label={t("table.thead.type")} />
            </TableHead>
            <TableHead>
              <OrderByButton column="brand" label={t("table.thead.brand")} />
            </TableHead>
            <TableHead>{t("table.thead.countDetail")}</TableHead>

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
                  <UserAvatar src={item.imageUrl || undefined} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{t(`schema.type.options.${item.type}`)}</TableCell>

                <TableCell>{item.brand}</TableCell>
                <TableCell>{item._count.equipmentDetails}</TableCell>
                <TableCell>
                  <EquipmentsTableAction data={item} />
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
