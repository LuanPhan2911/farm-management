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
import { EquipmentUsageTable } from "@/types";

import { OrderByButton } from "@/components/buttons/order-by-button";

import { SearchBar } from "@/components/search-bar";

import { useDialog } from "@/stores/use-dialog";
import { SelectItemContent } from "@/components/form/select-item";
import { EquipmentUsagesTableAction } from "./equipment-usages-table-action";
import { EquipmentDetailStatusValue } from "../../../../_components/equipment-detail-status-value";

interface EquipmentUsagesTableProps {
  data: EquipmentUsageTable[];
  totalPage: number;
}
export const EquipmentUsagesTable = ({
  data,
  totalPage,
}: EquipmentUsagesTableProps) => {
  const { onOpen } = useDialog();
  const t = useTranslations("equipmentUsages");
  const { dateTime } = useFormatter();
  const handleEdit = (row: EquipmentUsageTable) => {
    onOpen("equipmentUsage.edit", { equipmentUsage: row });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("table.thead.activity.usage")}</TableHead>
            <TableHead>
              <OrderByButton
                column="usageStartTime"
                label={t("table.thead.usageStartTime")}
              />
            </TableHead>
            <TableHead className="w-[250px]">
              {t("table.thead.equipmentDetail.name")}
            </TableHead>
            <TableHead>{t("table.thead.equipmentDetail.status")}</TableHead>
            <TableHead className="w-[250px]">
              {t("table.thead.equipmentDetail.location")}
            </TableHead>
            <TableHead>{t("table.thead.duration")}</TableHead>
            <TableHead>{t("table.thead.operator")}</TableHead>
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
                <TableCell className="font-semibold">
                  {item.activity ? (
                    <span className="text-green-400">
                      {t("table.trow.activity.usage")}
                    </span>
                  ) : (
                    <span className="text-rose-400">
                      {t("table.trow.activity.unused")}
                    </span>
                  )}
                </TableCell>
                <TableCell>{dateTime(item.usageStartTime, "long")}</TableCell>
                <TableCell>{item.equipmentDetail.name}</TableCell>
                <TableCell>
                  <EquipmentDetailStatusValue
                    status={item.equipmentDetail.status}
                  />
                </TableCell>
                <TableCell>
                  {item.equipmentDetail.location ||
                    t("table.trow.equipmentDetail.location")}
                </TableCell>
                <TableCell>{item.duration}</TableCell>

                <TableCell>
                  <SelectItemContent
                    imageUrl={item.operator?.imageUrl || null}
                    title={item.operator?.name || t("table.trow.operator")}
                    description={item.operator?.email}
                  />
                </TableCell>
                <TableCell>
                  <EquipmentUsagesTableAction data={item} />
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
