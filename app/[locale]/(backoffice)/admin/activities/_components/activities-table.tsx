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
import { ActivitiesTableAction } from "./activities-table-action";

import { OrderByButton } from "@/components/buttons/order-by-button";

import { SearchBar } from "@/components/search-bar";
import { ActivityStatusValue } from "./activity-status-value";
import { ActivityPriorityValue } from "./activity-priority-value";
import { SelectItemContent } from "@/components/form/select-item";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

interface ActivitiesTableProps {
  data: ActivityTable[];
  totalPage: number;
}
export const ActivitiesTable = ({ data, totalPage }: ActivitiesTableProps) => {
  const router = useRouterWithRole();
  const { dateTime } = useFormatter();
  const t = useTranslations("activities");
  const handleViewDetail = (row: ActivityTable) => {
    router.push(`activities/detail/${row.id}`);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
      </div>

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
            <TableHead>{t("table.thead.estimatedDuration")}</TableHead>
            <TableHead>{t("table.thead.createdBy")}</TableHead>
            <TableHead>{t("table.thead.assignedTo")}</TableHead>
            <TableHead>{t("table.thead.countEquipmentUsage")}</TableHead>
            <TableHead>{t("table.thead.countMaterialUsage")}</TableHead>
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
                <TableCell>{dateTime(item.activityDate, "short")}</TableCell>
                <TableCell className="lg:w-[350px]">{item.name}</TableCell>
                <TableCell>
                  <ActivityStatusValue value={item.status} />
                </TableCell>

                <TableCell>
                  <ActivityPriorityValue value={item.priority} />
                </TableCell>
                <TableCell>
                  {item.estimatedDuration || t("table.trow.estimatedDuration")}
                </TableCell>
                <TableCell>
                  <SelectItemContent
                    imageUrl={item.createdBy.imageUrl}
                    title={item.createdBy.name}
                    description={item.createdBy.email}
                  />
                </TableCell>
                <TableCell>
                  <SelectItemContent
                    imageUrl={item.assignedTo.imageUrl}
                    title={item.assignedTo.name}
                    description={item.assignedTo.email}
                  />
                </TableCell>
                <TableCell>{item._count.equipmentUseds}</TableCell>
                <TableCell>{item._count.materialUseds}</TableCell>
                <TableCell>
                  <ActivitiesTableAction data={item} />
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
