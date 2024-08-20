"use client";
import { DataTable } from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { ApplicantsTableAction } from "./applicants-table-action";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { deleteMany } from "@/actions/applicant";
import { toast } from "sonner";
import { Applicant, ApplicantStatus } from "@prisma/client";
import { ApplicantSelectJob } from "./applicant-select-job";
import { JobSelect } from "@/types";
import { Badge } from "@/components/ui/badge";

interface ApplicantsTableProps {
  applicants: Applicant[];
  jobs: JobSelect[];
}
export const ApplicantsTable = ({ applicants, jobs }: ApplicantsTableProps) => {
  const tTable = useTranslations("applicants.table");
  const tSearch = useTranslations("applicants.search");
  const tBulkAction = useTranslations("applicants.table.bulkAction");
  const tForm = useTranslations("form");
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
          <DataTableColumnHeader column={column} title={tTable("thead.name")} />
        );
      },
    },
    {
      accessorKey: "email",
      header: tTable("thead.email"),
    },
    {
      accessorKey: "address",
      header: tTable("thead.address"),
    },
    {
      accessorKey: "phone",
      header: tTable("thead.phone"),
    },
    {
      accessorKey: "status",
      header: tTable("thead.status"),
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
      label: tBulkAction("deleteSelected.label"),
      action: (rows: Applicant[]) => {
        onOpen({
          title: tBulkAction("deleteSelected.title"),
          description: tBulkAction("deleteSelected.description"),
          onConfirm: () => {
            const ids = rows.map((row) => row.id);
            deleteMany(ids)
              .then(({ message, ok }) => {
                if (ok) {
                  toast.success(message);
                } else {
                  toast.error(message);
                }
              })
              .catch((error: Error) => {
                toast.error(tForm("error"));
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
        <div className="flex justify-end">
          <ApplicantSelectJob data={jobs} />
        </div>
        <DataTable
          columns={columns}
          data={applicants}
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
