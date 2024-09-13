"use client";
import { DataTable } from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormatter, useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { JobsTableAction } from "./jobs-table-action";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { destroyMany } from "@/actions/job";
import { toast } from "sonner";
import { JobTable } from "@/types";
import { JobPublishedSwitch } from "./job-published-switch";
import { JobExpired } from "./job-expired";
import { JobCreateButton } from "./job-create-button";
import { Job, JobExperience } from "@prisma/client";
import { useTransition } from "react";

interface JobsTableProps {
  data: JobTable[];
}
export const JobsTable = ({ data }: JobsTableProps) => {
  const tSchema = useTranslations("jobs.schema");
  const t = useTranslations("jobs");
  const [isPending, startTransition] = useTransition();
  const { dateTime } = useFormatter();
  const { onOpen, onClose } = useAlertDialog();

  const handleConfirm = (rows: JobTable[]) => {
    startTransition(() => {
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
    });
  };
  const columns: ColumnDef<JobTable>[] = [
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
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.name")}
          />
        );
      },
    },
    {
      accessorKey: "quantity",
      header: t("table.thead.quantity"),
    },
    {
      accessorKey: "experience",
      header: t("table.thead.experience"),
      cell: ({ row }) => {
        const data = row.original.experience;
        return tSchema(`experience.options.${data}`);
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "gender",
      header: t("table.thead.gender"),
      cell: ({ row }) => {
        const data = row.original.gender;
        return tSchema(`gender.options.${data}`);
      },
    },
    {
      accessorKey: "expiredAt",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.expiredAt")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original.expiredAt;
        return dateTime(data);
      },
    },
    {
      accessorKey: "status",
      header: t("table.thead.status"),
      cell: ({ row }) => {
        const data = row.original.expiredAt;
        return <JobExpired expiredAt={data} />;
      },
    },
    {
      accessorKey: "published",
      header: t("table.thead.published"),
      cell: ({ row }) => {
        const { id, published } = row.original;
        return <JobPublishedSwitch id={id} published={published} />;
      },
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
      label: t("form.destroySelected.label"),
      action: (rows: JobTable[]) => {
        onOpen({
          title: t("form.destroySelected.title"),
          description: t("form.destroySelected.description"),
          onConfirm: () => handleConfirm(rows),
          isPending,
        });
      },
    },
  ];
  const facetedFilters = [
    {
      column: "experience",
      label: t("search.faceted.experience.placeholder"),
      options: Object.values(JobExperience).map((item) => {
        return {
          label: t(`schema.experience.options.${item}`),
          value: item,
        };
      }),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("page.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <JobCreateButton />
        </div>
        <DataTable
          columns={columns}
          data={data}
          searchable={{
            value: "name",
            placeholder: t("search.placeholder"),
          }}
          bulkActions={bulkActions}
          facetedFilters={facetedFilters}
        />
      </CardContent>
    </Card>
  );
};
