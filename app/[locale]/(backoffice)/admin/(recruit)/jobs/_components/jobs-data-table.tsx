"use client";
import { DataTable } from "@/components/datatable";

import { useFormatter, useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { JobsTableAction } from "./jobs-table-action";
import { editPublished } from "@/actions/job";
import { JobTable } from "@/types";
import { JobExpiredValue } from "./job-expired-value";
import { JobExperience } from "@prisma/client";
import { ConfirmButton } from "@/components/buttons/confirm-button";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface JobsTableProps {
  data: JobTable[];
}
export const JobsTable = ({ data }: JobsTableProps) => {
  const tSchema = useTranslations("jobs.schema");
  const t = useTranslations("jobs");

  const { isSuperAdmin } = useCurrentStaffRole();
  const { dateTime } = useFormatter();

  const router = useRouterWithRole();

  const handleEdit = (job: JobTable) => {
    if (!isSuperAdmin) {
      return;
    }
    router.push(`jobs/edit/${job.id}`);
  };
  const columns: ColumnDef<JobTable>[] = [
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
        return dateTime(data, "long");
      },
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
      accessorKey: "status",
      header: t("table.thead.status"),
      cell: ({ row }) => {
        const data = row.original.expiredAt;
        return <JobExpiredValue expiredAt={data} />;
      },
    },
    {
      accessorKey: "quantity",
      header: t("table.thead.quantity"),
      cell: ({ row }) => {
        const data = row.original;
        return <p className="text-center">{data.quantity}</p>;
      },
    },

    {
      accessorKey: "published",
      header: t("table.thead.published"),
      cell: ({ row }) => {
        const data = row.original;
        return (
          <ConfirmButton
            checked={data.published}
            confirmFn={() => editPublished(data.id, !data.published)}
            label={t("form.editPublished.label")}
            title={t("form.editPublished.title")}
            description={t("form.editPublished.description")}
            isButton={false}
            disabled={!isSuperAdmin}
          />
        );
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
    <DataTable
      columns={columns}
      data={data}
      searchable={{
        value: "name",
        placeholder: t("search.placeholder"),
      }}
      facetedFilters={facetedFilters}
      onViewDetail={handleEdit}
    />
  );
};
