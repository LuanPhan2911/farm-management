"use client";

import { DataTable } from "@/components/datatable";

import { useFormatter, useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { ScheduleResponse } from "@/types";

import { parseToDate } from "@/lib/utils";

import { Hint } from "@/components/hint";
import { useSheet } from "@/stores/use-sheet";
import { SchedulesTableAction } from "./schedules-table-action";
import { Badge } from "@/components/ui/badge";
import { ConfirmButton } from "@/components/buttons/confirm-button";
import { editPaused } from "@/actions/schedule";

interface ScheduleDataTableProps {
  data: ScheduleResponse[];
}
export const SchedulesDataTable = ({ data }: ScheduleDataTableProps) => {
  const t = useTranslations("schedules");

  const { relativeTime, dateTime } = useFormatter();
  const { onOpen: onOpenEdit } = useSheet();

  const handleEdit = (data: ScheduleResponse) => {
    onOpenEdit("schedule.edit", { schedule: data });
  };
  const columns: ColumnDef<ScheduleResponse>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.schedule")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="space-y-1">
            <div className="font-mono text-md">
              {data.name}{" "}
              {data.paused ? (
                <Badge variant={"edit"}>Paused</Badge>
              ) : (
                <Badge variant={"success"}>Running</Badge>
              )}
            </div>
            <div className="text-muted-foreground">{data.id}</div>
            <div className="text-muted-foreground">{data.request.url}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "paused",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.paused")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ row }) => {
        const data = row.original;

        return (
          <ConfirmButton
            checked={data.paused}
            confirmFn={() =>
              editPaused(
                {
                  ...data,
                  paused: !data.paused,
                },
                data.id
              )
            }
            label={t("form.editPaused.label")}
            title={t("form.editPaused.title")}
            description={t("form.editPaused.description")}
            isButton={false}
          />
        );
      },
    },
    {
      accessorKey: "cron",
      header: t("table.thead.cron"),
    },
    {
      accessorKey: "scheduled_for",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.scheduled_for")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        const scheduleFor = parseToDate(data.scheduled_for);
        if (!scheduleFor) {
          return "-";
        }
        return (
          <Hint
            label={dateTime(scheduleFor, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          >
            {relativeTime(scheduleFor)}
          </Hint>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.created_at")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        const createdAt = parseToDate(data.created_at);
        if (!createdAt) {
          return "-";
        }
        return (
          <Hint
            label={dateTime(createdAt, {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          >
            {relativeTime(createdAt)}
          </Hint>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <SchedulesTableAction data={data} />;
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      onViewDetail={handleEdit}
      searchable={{
        placeholder: t("search.placeholder"),
        value: "name",
      }}
    />
  );
};
