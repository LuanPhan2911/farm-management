"use client";

import { destroyMany } from "@/actions/task";
import { DataTable } from "@/components/datatable";

import { useFormatter, useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { toast } from "sonner";
import { TaskResponse, TaskStatus } from "@/types";
import { useAlertDialog } from "@/stores/use-alert-dialog";

import { TaskStatusValue } from "./task-status-value";
import { parseToDate } from "@/lib/utils";
import { TaskCreateButton } from "./task-create-button";
import { Hint } from "@/components/hint";
import { useSheet } from "@/stores/use-sheet";
import { TasksTableAction } from "./tasks-table-action";

interface TaskDataTableProps {
  data: TaskResponse[];
}
export const TasksDataTable = ({ data }: TaskDataTableProps) => {
  const t = useTranslations("tasks");
  const { onOpen, onClose, setPending } = useAlertDialog();

  const { relativeTime, dateTime } = useFormatter();
  const { onOpen: onOpenEdit } = useSheet();
  const handleConfirm = (rows: TaskResponse[]) => {
    setPending(true);
    const ids = rows.map((row) => row.id);
    destroyMany(ids)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error(t("status.failure.destroy"));
      })
      .finally(() => {
        onClose();
      });
  };
  const handleEdit = (data: TaskResponse) => {
    if (data.status !== "queued") {
      toast.warning("Task can be edit when status is queue!");
    } else {
      onOpenEdit("task.edit", { task: data });
    }
  };
  const columns: ColumnDef<TaskResponse>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => {
            e.stopPropagation();
          }}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "task",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.task")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        return (
          <div className="space-y-1">
            <div className="font-mono text-md">{data.name}</div>
            <div className="text-muted-foreground">{data.id}</div>
            <div className="text-muted-foreground">{data.request.url}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.status")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ row }) => {
        const data = row.original;

        return <TaskStatusValue status={data.status} />;
      },
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
        return <TasksTableAction data={data} />;
      },
    },
  ];
  const bulkActions = [
    {
      label: t("form.destroyMany.label"),
      action: (rows: TaskResponse[]) => {
        onOpen({
          title: t("form.destroyMany.title"),
          description: t("form.destroyMany.description"),
          onConfirm: () => handleConfirm(rows),
        });
      },
    },
  ];
  const facetedFilters = [
    {
      column: "status",
      label: t("search.faceted.status.placeholder"),
      options: (() => {
        const status: TaskStatus[] = [
          "queued",
          "failure",
          "success",
          "working",
        ];
        return status.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
      })(),
    },
  ];
  return (
    <>
      <div className="flex justify-end gap-x-2">
        <TaskCreateButton />
      </div>
      <DataTable
        columns={columns}
        data={data}
        bulkActions={bulkActions}
        onViewDetail={handleEdit}
        facetedFilters={facetedFilters}
      />
    </>
  );
};
