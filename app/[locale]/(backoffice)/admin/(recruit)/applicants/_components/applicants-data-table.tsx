"use client";
import { DataTable } from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { ApplicantsTableAction } from "./applicants-table-action";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { destroyMany } from "@/actions/applicant";
import { toast } from "sonner";
import { Applicant, ApplicantStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { JobSelectWithQueryClient } from "../../../_components/jobs-select";

interface ApplicantsTableProps {
  applicants: Applicant[];
}
export const ApplicantsTable = ({ applicants }: ApplicantsTableProps) => {
  const t = useTranslations("applicants");

  const { onOpen, onClose } = useAlertDialog();

  const columns: ColumnDef<Applicant>[] = [
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
      accessorKey: "email",
      header: t("table.thead.email"),
    },
    {
      accessorKey: "address",
      header: t("table.thead.address"),
    },
    {
      accessorKey: "phone",
      header: t("table.thead.phone"),
    },
    {
      accessorKey: "status",
      header: t("table.thead.status"),
      cell: ({ row }) => {
        const data = row.original;
        if (data.status === ApplicantStatus.NEW) {
          return <Badge variant={"info"}>{data.status}</Badge>;
        }
        return <Badge variant={"success"}>{data.status}</Badge>;
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <ApplicantsTableAction data={data} />;
      },
    },
  ];

  const bulkActions = [
    {
      label: t("form.destroySelected.label"),
      action: (rows: Applicant[]) => {
        onOpen({
          title: t("form.destroySelected.title"),
          description: t("form.destroySelected.description"),
          onConfirm: () => {
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
          },
        });
      },
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("page.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <JobSelectWithQueryClient />
        </div>
        <DataTable
          columns={columns}
          data={applicants}
          searchable={{
            value: "name",
            placeholder: t("search.placeholder"),
          }}
          bulkActions={bulkActions}
        />
      </CardContent>
    </Card>
  );
};
