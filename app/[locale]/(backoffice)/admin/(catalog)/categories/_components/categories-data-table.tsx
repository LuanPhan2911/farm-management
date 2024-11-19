"use client";
import { DataTable } from "@/components/datatable";

import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/ui/checkbox";

import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { CategoryType } from "@prisma/client";
import { CategoriesTableAction } from "./categories-table-action";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { destroyMany } from "@/actions/category";
import { toast } from "sonner";
import { useDialog } from "@/stores/use-dialog";
import { CategoryTable } from "@/types";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useDialogConfirmCode } from "@/stores/use-dialog-confirm-code";

interface CategoriesTableProps {
  data: CategoryTable[];
}
export const CategoriesTable = ({ data }: CategoriesTableProps) => {
  const t = useTranslations("categories");

  const { onOpen, onClose, setPending } = useDialogConfirmCode();
  const { onOpen: onOpenEdit } = useDialog();
  const { isSuperAdmin } = useCurrentStaffRole();
  const handleConfirm = async (rows: CategoryTable[]) => {
    const ids = rows.map((row) => row.id);
    setPending(true);
    try {
      const { message, ok } = await destroyMany(ids);
      if (ok) {
        onClose();
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Internal error");
    } finally {
      onClose();
    }
  };
  const handleEdit = (data: CategoryTable) => {
    onOpenEdit("category.edit", {
      category: data,
    });
  };
  const columns: ColumnDef<CategoryTable>[] = [
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
          onClick={(e) => e.stopPropagation()}
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
      label: t("form.destroyMany.label"),
      action: (rows: CategoryTable[]) => {
        onOpen({
          title: t("form.destroyMany.title"),
          description: t("form.destroyMany.description"),
          onConfirm: () => handleConfirm(rows),
          confirmCode: "DELETE_CATEGORIES",
        });
      },
      disabled: !isSuperAdmin,
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
    <DataTable
      columns={columns}
      data={data}
      searchable={{
        value: "name",
        placeholder: t("search.placeholder"),
      }}
      bulkActions={bulkActions}
      facetedFilters={facetedFilters}
      onViewDetail={handleEdit}
    />
  );
};
