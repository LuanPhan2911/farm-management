"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFormatter, useTranslations } from "next-intl";
import { ActivityWithCost } from "@/types";

import { OrderByButton } from "@/components/buttons/order-by-button";

import { SearchBar } from "@/components/search-bar";

import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { ActivitiesTableFaceted } from "@/app/[locale]/(backoffice)/admin/activities/_components/activities-table-faceted";
import { ActivityStatusValue } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-status-value";
import { ActivityPriorityValue } from "@/app/[locale]/(backoffice)/admin/activities/_components/activity-priority-value";

interface CropActivitiesTableProps {
  data: ActivityWithCost[];
  totalCost: number;
}
export const CropActivitiesTable = ({
  data,
  totalCost,
}: CropActivitiesTableProps) => {
  const router = useRouterWithRole();
  const { dateTime, number } = useFormatter();
  const t = useTranslations("activities");

  const handleViewDetail = (row: ActivityWithCost) => {
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
            <TableHead className="text-right">
              {t("table.thead.estimatedDuration")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.actualDuration")}
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
            <TableHead className="text-right">
              {t("table.thead.actualCost")}
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
                <TableCell className="text-right">
                  {number(item.estimatedDuration, "hour")}
                </TableCell>
                <TableCell className="text-right">
                  {item.actualDuration
                    ? number(item.actualDuration, "hour")
                    : t("table.trow.actualDuration")}
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
                <TableCell className="text-right">
                  {item.actualCost
                    ? number(item.actualCost, "currency")
                    : t("table.trow.actualCost")}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={9}>{t("table.tfooter.totalCost")}</TableCell>
            <TableCell className="text-right">
              {number(totalCost, "currency")}
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {!data.length && (
        <div className="my-4 text-muted-foreground flex justify-center">
          No results.
        </div>
      )}
    </>
  );
};
