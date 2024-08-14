"use client";
import { DataTable } from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormatter, useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Job } from "@prisma/client";
import { JobsTableAction } from "./jobs-table-action";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { deleteMany } from "@/actions/job";
import { toast } from "sonner";

interface JobsTableProps {
  data: Job[];
}
export const JobsTable = ({ data }: JobsTableProps) => {
  const tTable = useTranslations("jobs.table");
  const tSearch = useTranslations("jobs.search");
  const tBulkAction = useTranslations("jobs.table.bulkAction");
  const tSchema = useTranslations("jobs.schema");
  const { onOpen, onClose } = useAlertDialog();
  const format = useFormatter();

  const columns: ColumnDef<Job>[] = [
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
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader column={column} title={tTable("thead.name")} />
        );
      },
    },
    {
      accessorKey: "quantity",
      header: tTable("thead.quantity"),
    },
    {
      accessorKey: "experience",
      header: tTable("thead.experience"),
      cell: ({ row }) => {
        const data = row.original.experience;
        return tSchema(`experience.options.${data}`);
      },
    },
    {
      accessorKey: "gender",
      header: tTable("thead.gender"),
      cell: ({ row }) => {
        const data = row.original.gender;
        return tSchema(`gender.options.${data}`);
      },
    },
    {
      accessorKey: "expiredAt",
      header: tTable("thead.expiredAt"),
      cell: ({ row }) => {
        const data = row.original.expiredAt;
        return format.dateTime(data, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      },
    },
    {
      accessorKey: "published",
      header: tTable("thead.published"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <JobsTableAction data={data} />;
      },
    },
  ];

  const bulkActions = [
    {
      label: tBulkAction("deleteSelected.label"),
      action: (rows: Job[]) => {
        onOpen({
          title: tBulkAction("deleteSelected.title"),
          description: tBulkAction("deleteSelected.description"),
          onConfirm: () => {
            const ids = rows.map((row) => row.id);
            deleteMany(ids)
              .then(({ message }) => {
                toast.success(message);
              })
              .catch((error: Error) => {
                toast.error(error.message);
              })
              .finally(() => {
                onClose();
              });
          },
        });
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tTable("heading")}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          filterColumn={{
            isShown: true,
            value: "name",
            placeholder: tSearch("placeholder"),
          }}
          bulkActions={bulkActions}
        />
      </CardContent>
    </Card>
  );
};
