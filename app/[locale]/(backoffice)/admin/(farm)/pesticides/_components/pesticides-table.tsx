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
import { PesticideTable } from "@/types";
import { PesticidesTableAction } from "./pesticides-table-action";

import { OrderByButton } from "@/components/buttons/order-by-button";
import { PesticidesTableFaceted } from "./pesticides-table-faceted";
import { SearchBar } from "@/components/search-bar";
import { useSearchParams } from "next/navigation";
import { includeString } from "@/lib/utils";
import { useDialog } from "@/stores/use-dialog";

interface PesticidesTableProps {
  data: PesticideTable[];
  totalPage: number;
}
export const PesticidesTable = ({ data, totalPage }: PesticidesTableProps) => {
  const searchParams = useSearchParams();
  const query = searchParams!.get("query");
  const { onOpen } = useDialog();
  const handleEdit = (row: PesticideTable) => {
    onOpen("pesticide.edit", { pesticide: row });
  };
  if (query) {
    data = data.filter((item) => includeString(item.name, query));
  }
  const t = useTranslations("pesticides");

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
        <PesticidesTableFaceted />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>{t("table.thead.type")}</TableHead>
            <TableHead>{t("table.thead.toxicityLevel")}</TableHead>
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
                <TableCell>
                  {item.type
                    ? t(`schema.type.options.${item.type}`)
                    : t("table.trow.type")}
                </TableCell>
                <TableCell>
                  {item.toxicityLevel
                    ? t(`schema.toxicityLevel.options.${item.toxicityLevel}`)
                    : t("table.trow.toxicityLevel")}
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
                  <PesticidesTableAction data={item} />
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
