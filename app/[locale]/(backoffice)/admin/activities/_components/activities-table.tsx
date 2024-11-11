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
import {
  ActivitiesSelectCreatedBy,
  ActivitiesTableFaceted,
} from "./activities-table-faceted";

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
      <div className="flex gap-2 items-center">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
        <ActivitiesSelectCreatedBy />
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
            <TableHead>{t("table.thead.crop")}</TableHead>
            <TableHead>{t("table.thead.createdBy")}</TableHead>
            <TableHead className="text-right">
              {t("table.thead.estimatedDuration")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.actualDuration")}
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
                  <SelectItemContentWithoutImage title={item.crop.name} />
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
                  {item.actualDuration
                    ? number(item.actualDuration, "hour")
                    : t("table.trow.actualDuration")}
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
