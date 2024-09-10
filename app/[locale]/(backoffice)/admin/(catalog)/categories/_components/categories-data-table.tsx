"use client";
import { DataTable } from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Category, CategoryType } from "@prisma/client";
import { CategoriesTableAction } from "./categories-table-action";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { destroyMany } from "@/actions/category";
import { toast } from "sonner";
import { CategoryCreateButton } from "./category-create-button";

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
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.slug")}
          />
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.type")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ row }) => {
        const data = row.original;
        if (!data.type) {
          return t("table.trow.type");
        }
        return t(`schema.type.options.${data.type}`);
      },
    },
    {
      accessorKey: "description",
      header: t("table.thead.description"),
      cell: ({ row }) => {
        const data = row.original;
        if (!data.description) {
          return t("table.trow.description");
        }
        return data.description;
      },
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
  const facetedFilters = [
    {
      column: "type",
      label: t("search.faceted.type.placeholder"),
      options: Object.values(CategoryType).map((item) => {
        return {
          label: t(`schema.type.options.${item}`),
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
          <CategoryCreateButton />
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
