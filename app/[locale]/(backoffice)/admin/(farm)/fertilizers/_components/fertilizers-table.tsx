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
import { FertilizerTable } from "@/types";
import { FertilizersTableAction } from "./fertilizers-table-action";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { FertilizersTableFaceted } from "./fertilizers-table-faceted";
import { SearchBar } from "@/components/search-bar";
import { useSearchParams } from "next/navigation";
import { includeString } from "@/lib/utils";
import { useDialog } from "@/stores/use-dialog";

interface FertilizersTableProps {
  data: FertilizerTable[];
  totalPage: number;
}
export const FertilizersTable = ({
  data,
  totalPage,
}: FertilizersTableProps) => {
  const searchParams = useSearchParams();
  const query = searchParams!.get("query");
  const { onOpen } = useDialog();
  const handleEdit = (row: FertilizerTable) => {
    onOpen("fertilizer.edit", {
      fertilizer: row,
    });
  };
  if (query) {
    data = data.filter((item) => includeString(item.name, query));
  }
  const t = useTranslations("fertilizers");

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
        <FertilizersTableFaceted />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>
              <OrderByButton column="type" label={t("table.thead.type")} />
            </TableHead>
            <TableHead>{t("table.thead.nutrientOfNPK")}</TableHead>
            <TableHead>{t("table.thead.frequencyOfUse")}</TableHead>
            <TableHead>{t("table.thead.applicationMethod")}</TableHead>
            <TableHead>{t("table.thead.manufacturer")}</TableHead>
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
                <TableCell>{item.name}</TableCell>
                <TableCell>{t(`schema.type.options.${item.type}`)}</TableCell>
                <TableCell>{item.nutrientOfNPK}</TableCell>
                <TableCell>
                  {item.frequencyOfUse
                    ? t(`schema.frequencyOfUse.options.${item.frequencyOfUse}`)
                    : t("table.trow.frequencyOfUse")}
                </TableCell>
                <TableCell>
                  {item.applicationMethod
                    ? item.applicationMethod
                    : t("table.trow.applicationMethod")}
                </TableCell>
                <TableCell>
                  {item.manufacturer
                    ? item.manufacturer
                    : t("table.trow.manufacturer")}
                </TableCell>
                <TableCell>
                  <FertilizersTableAction data={item} />
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
