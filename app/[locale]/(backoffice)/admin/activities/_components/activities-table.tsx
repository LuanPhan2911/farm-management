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
import { SelectData, SelectOptions } from "@/components/form/select-options";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import {
  SelectItemContent,
  SelectItemContentWithoutImage,
} from "@/components/form/select-item";

interface ActivitiesTableProps {
  data: ActivityTable[];
  totalPage: number;
  detailUrl?: (row: ActivityTable) => string;
}
export const ActivitiesTable = ({
  data,
  totalPage,
  detailUrl,
}: ActivitiesTableProps) => {
  const router = useRouterWithRole();
  const { dateTime } = useFormatter();
  const t = useTranslations("activities");
  const { isFarmer } = useCurrentStaffRole();
  const handleViewDetail = (row: ActivityTable) => {
    router.push(detailUrl ? detailUrl(row) : `activities/detail/${row.id}`);
  };
  const { updateSearchParam, initialParam } = useUpdateSearchParam(
    "type",
    "assignedTo"
  );
  const selectData: SelectData[] = [
    {
      label: "Assigned To",
      value: "assignedTo",
    },
    {
      label: "Created By",
      value: "createdBy",
    },
  ];

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-2 my-2 lg:items-center">
        <SearchBar isPagination placeholder={t("search.placeholder")} />
        <div className="lg:w-[250px]">
          <SelectOptions
            options={selectData}
            onChange={updateSearchParam}
            defaultValue={initialParam}
            placeholder="Select type"
            disabledValues={isFarmer ? ["createdBy"] : []}
          />
        </div>
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
            <TableHead className="w-[250px]">
              <OrderByButton column="name" label={t("table.thead.name")} />
            </TableHead>
            <TableHead>{t("table.thead.status")}</TableHead>
            <TableHead>{t("table.thead.priority")}</TableHead>
            <TableHead>{t("table.thead.estimatedDuration")}</TableHead>
            <TableHead className="w-[250px]">
              {t("table.thead.crop.field.name")}
            </TableHead>
            <TableHead className="w-[250px]">
              {t("table.thead.crop.plant.name")}
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
                  {item.estimatedDuration || t("table.trow.estimatedDuration")}
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
