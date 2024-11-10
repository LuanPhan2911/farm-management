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
import { ActivityTable } from "@/types";

import { OrderByButton } from "@/components/buttons/order-by-button";

import { SearchBar } from "@/components/search-bar";
import { ActivityStatusValue } from "./activity-status-value";
import { ActivityPriorityValue } from "./activity-priority-value";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import {
  SelectItemContent,
  SelectItemContentWithoutImage,
} from "@/components/form/select-item";
import { ActivitiesTableFaceted } from "./activities-table-faceted";

interface ActivitiesTableProps {
  data: ActivityTable[];
  totalPage: number;
}
export const ActivitiesTable = ({ data, totalPage }: ActivitiesTableProps) => {
  const router = useRouterWithRole();
  const { dateTime, number } = useFormatter();
  const t = useTranslations("activities");

  const handleViewDetail = (row: ActivityTable) => {
    router.pushDetail(`detail/${row.id}`);
  };

  return (
    <>
      <ActivitiesTableFaceted />
      <SearchBar isPagination placeholder={t("search.placeholder")} />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <OrderByButton
                column="activityDate"
                label={t("table.thead.activityDate")}
                defaultValue="desc"
              />
            </TableHead>
            <TableHead>
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>{t("table.thead.status")}</TableHead>
            <TableHead>{t("table.thead.priority")}</TableHead>
            <TableHead>{t("table.thead.crop.field.name")}</TableHead>
            <TableHead>{t("table.thead.crop.plant.name")}</TableHead>
            <TableHead>{t("table.thead.createdBy")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.estimatedDuration")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.totalStaffCost")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.totalEquipmentCost")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.totalMaterialCost")}
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
                <TableCell>{dateTime(item.activityDate, "long")}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  <ActivityStatusValue value={item.status} />
                </TableCell>
                <TableCell>
                  <ActivityPriorityValue value={item.priority} />
                </TableCell>

                <TableCell>
                  <SelectItemContentWithoutImage
                    title={item.crop.field.name}
                    description={item.crop.field.location}
                  />
                </TableCell>
                <TableCell>
                  <SelectItemContent
                    imageUrl={item.crop.plant.imageUrl}
                    title={item.crop.plant.name}
                  />
                </TableCell>
                <TableCell>
                  <SelectItemContent
                    imageUrl={item.createdBy.imageUrl}
                    title={item.createdBy.name}
                    description={item.createdBy.email}
                  />
                </TableCell>
                <TableCell className="text-right">
                  {number(item.estimatedDuration, "hour")}
                </TableCell>
                <TableCell className="text-right">
                  {item.totalStaffCost
                    ? number(item.totalStaffCost, "currency")
                    : t("table.trow.totalStaffCost")}
                </TableCell>
                <TableCell className="text-right">
                  {item.totalEquipmentCost
                    ? number(item.totalEquipmentCost, "currency")
                    : t("table.trow.totalEquipmentCost")}
                </TableCell>
                <TableCell className="text-right">
                  {item.totalMaterialCost
                    ? number(item.totalMaterialCost, "currency")
                    : t("table.trow.totalMaterialCost")}
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
