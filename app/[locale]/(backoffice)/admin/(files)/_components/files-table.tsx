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
import {
  FilesTableAction,
  FilesTableActionContextMenu,
} from "./files-table-action";
import { Staff } from "@prisma/client";

import { isImage } from "@/lib/utils";
interface FilesTableProps {
  data: FileWithOwner[];
  totalPage: number;
  currentStaff: Staff;
}
export const FilesTable = ({
  data,
  totalPage,
  currentStaff,
}: FilesTableProps) => {
  const { dateTime } = useFormatter();
  const t = useTranslations("files");
  return (
    <>
      <SearchBar isPagination placeholder={t("search.placeholder")} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.thead.url")}</TableHead>
            <TableHead>
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>{t("table.thead.type")}</TableHead>
            <TableHead>{t("table.thead.owner")}</TableHead>
            <TableHead>
              <OrderByButton
                column="createdAt"
                label={t("table.thead.createdAt")}
                defaultValue="desc"
              />
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            return (
              <FilesTableActionContextMenu
                key={item.id}
                data={item}
                currentStaff={currentStaff}
              >
                <TableRow className="cursor-pointer">
                  <TableCell>
                    {isImage(item.type) ? (
                      <div className="h-10 w-10 relative rounded-lg">
                        <Image src={item.url} alt="Image" fill />
                      </div>
                    ) : (
                      <div className="h-16 w-16 flex items-center justify-center border rounded-lg">
                        <span className="text-blue-300">{item.type}</span>
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
                    {dateTime(item.createdAt, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <FilesTableAction data={item} currentStaff={currentStaff} />
                  </TableCell>
                </TableRow>
              </FilesTableActionContextMenu>
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
