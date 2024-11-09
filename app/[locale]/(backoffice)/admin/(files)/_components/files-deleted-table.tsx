"use client";
import { OrderByButton } from "@/components/buttons/order-by-button";
import { SelectItemContent } from "@/components/form/select-item";
import { NavPagination } from "@/components/nav-pagination";
import { SearchBar } from "@/components/search-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FileWithOwner } from "@/types";
import { useFormatter, useTranslations } from "next-intl";
import Image from "next/image";

import { isImage, isJson, isPDF } from "@/lib/utils";
import {
  FilesDeletedTableAction,
  FilesDeletedTableActionContextMenu,
} from "./files-deleted-table-action";
import { FileJson, FileText } from "lucide-react";
interface FilesDeletedTableProps {
  data: FileWithOwner[];
  totalPage: number;
}
export const FilesDeletedTable = ({
  data,
  totalPage,
}: FilesDeletedTableProps) => {
  const { dateTime } = useFormatter();
  const t = useTranslations("files");
  return (
    <>
      <SearchBar isPagination placeholder={t("search.placeholder")} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead className="min-w-[250px]">
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>{t("table.thead.type")}</TableHead>
            <TableHead>{t("table.thead.owner")}</TableHead>
            <TableHead>{t("table.thead.messageId")}</TableHead>
            <TableHead>
              <OrderByButton
                column="deletedAt"
                label={t("table.thead.deletedAt")}
                defaultValue="desc"
              />
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <FilesDeletedTableActionContextMenu key={item.id} data={item}>
                <TableRow className="cursor-pointer">
                  <TableCell>
                    {isImage(item.type) ? (
                      <div className="h-10 w-10 relative rounded-lg">
                        <Image src={item.url} alt="Image" fill />
                      </div>
                    ) : (
                      <div className="h-10 w-10 flex items-center justify-center border rounded-lg">
                        {isPDF(item.type) && <FileText className="h-8 w-8" />}
                        {isJson(item.type) && <FileJson className="h-8 w-8" />}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>
                    <SelectItemContent
                      imageUrl={item.owner.imageUrl}
                      title={item.owner.name}
                    />
                  </TableCell>
                  <TableCell>
                    {item.messageId ? (
                      <span className="text-green-500 font-semibold">
                        Deleted message
                      </span>
                    ) : (
                      <span className="text-blue-500 font-semibold">
                        My files
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.deletedAt ? dateTime(item.deletedAt, "long") : "Null"}
                  </TableCell>
                  <TableCell>
                    <FilesDeletedTableAction data={item} />
                  </TableCell>
                </TableRow>
              </FilesDeletedTableActionContextMenu>
            );
          })}
        </TableBody>
      </Table>
      {!data.length && (
        <div className="my-4 text-muted-foreground text-center">
          No results.
        </div>
      )}

      <div className="py-4">
        <NavPagination totalPage={totalPage} />
      </div>
    </>
  );
};
