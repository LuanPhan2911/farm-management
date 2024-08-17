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
import { Applicant } from "@prisma/client";

interface ApplicantsTableProps {
  data: Applicant[];
}
export const ApplicantsTable = ({ data }: ApplicantsTableProps) => {
  const tTable = useTranslations("applicants.table");
  const tSearch = useTranslations("applicants.search");
  const tBulkAction = useTranslations("applicants.table.bulkAction");
  const tSchema = useTranslations("applicants.schema");
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
