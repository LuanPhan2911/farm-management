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
import { useRouter } from "@/navigation";

interface EquipmentsTableProps {
  data: EquipmentTable[];
  totalPage: number;
}
export const EquipmentsTable = ({ data, totalPage }: EquipmentsTableProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("query");

  if (query) {
    data = data.filter((item) => includeString(item.name, query));
  }
  const t = useTranslations("equipments");
  const handleEdit = (row: EquipmentTable) => {
    router.push(`/admin/equipments/edit/${row.id}`);
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
              <OrderByButton column="status" label={t("table.thead.status")} />
            </TableHead>
            <TableHead>
              <OrderByButton
                column="location"
                label={t("table.thead.location")}
              />
            </TableHead>
            <TableHead>
              <OrderByButton column="brand" label={t("table.thead.brand")} />
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
                  <UserAvatar src={item.imageUrl || undefined} size={"lg"} />
                </TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{t(`schema.type.options.${item.type}`)}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.brand}</TableCell>

                <TableCell>
                  <EquipmentsTableAction data={item} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="py-4">
        <NavPagination totalPage={totalPage} />
      </div>
    </>
  );
};
