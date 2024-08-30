"use client";
import { DataTable } from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Category } from "@prisma/client";
import { CategoriesTableAction } from "./categories-table-action";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { destroyMany } from "@/actions/category";
import { toast } from "sonner";

interface CategoriesTableProps {
  data: Category[];
}
export const CategoriesTable = ({ data }: CategoriesTableProps) => {
  const t = useTranslations("categories");

  const { onOpen, onClose } = useAlertDialog();

  const columns: ColumnDef<Category>[] = [
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
      accessorKey: "slug",
      header: "Slug",
    },
    {
      accessorKey: "description",
      header: t("table.thead.description"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <CategoriesTableAction data={data} />;
      },
    },
  ];

  const bulkActions = [
    {
      label: t("form.destroySelected.label"),
      action: (rows: Category[]) => {
        onOpen({
          title: t("form.destroySelected.title"),
          description: t("form.destroySelected.description"),
          onConfirm: () => {
            const ids = rows.map((row) => row.id);
            destroyMany(ids)
              .then(({ message, ok }) => {
                if (ok) {
                  onClose();
                  toast.success(message);
                } else {
                  toast.error(message);
                }
              })
              .catch((error) => {
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
        <CardTitle>{t("table.heading")}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          filterColumn={{
            isShown: true,
            value: "name",
            placeholder: t("search.placeholder"),
          }}
          bulkActions={bulkActions}
        />
      </CardContent>
    </Card>
  );
};
