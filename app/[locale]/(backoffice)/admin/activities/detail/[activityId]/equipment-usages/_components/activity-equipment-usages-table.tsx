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

import { ActivityStatusValue } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-status-value";
import { useDialog } from "@/stores/use-dialog";
import { SelectItemContent } from "@/components/form/select-item";

import { UserAvatar } from "@/components/user-avatar";
import { EquipmentDetailStatusValue } from "@/app/[locale]/(backoffice)/admin/(inventory)/equipments/detail/[equipmentId]/_components/equipment-detail-status-value";
import { ActivityEquipmentUsagesTableAction } from "./activity-equipment-usages-table-action";

interface ActivityEquipmentUsagesTableProps {
  data: EquipmentUsageTable[];
}
export const ActivityEquipmentUsagesTable = ({
  data,
}: ActivityEquipmentUsagesTableProps) => {
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
            <TableHead className="lg:w-[200px]">
              <OrderByButton
                column="usageStartTime"
                label={t("table.thead.usageStartTime")}
              />
            </TableHead>
            <TableHead>{t("table.thead.activity.usage")}</TableHead>
            <TableHead>{t("table.thead.equipmentDetail.imageUrl")}</TableHead>
            <TableHead className="lg:w-[200px]">
              {t("table.thead.equipmentDetail.name")}
            </TableHead>
            <TableHead>{t("table.thead.equipmentDetail.status")}</TableHead>

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
                <TableCell className="text-center">
                  {dateTime(item.usageStartTime, "short")}
                </TableCell>
                <TableCell>
                  {item.activity ? (
                    <span className="text-green-400">
                      {t("table.trow.activity.usage")}
                    </span>
                  ) : (
                    t("table.trow.activity.unused")
                  )}
                </TableCell>
                <TableCell>
                  <UserAvatar
                    src={item.equipmentDetail.equipment.imageUrl || undefined}
                  />
                </TableCell>
                <TableCell>{item.equipmentDetail.name}</TableCell>
                <TableCell>
                  <EquipmentDetailStatusValue
                    status={item.equipmentDetail.status}
                  />
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
                  <ActivityEquipmentUsagesTableAction data={item} />
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
    </>
  );
};
