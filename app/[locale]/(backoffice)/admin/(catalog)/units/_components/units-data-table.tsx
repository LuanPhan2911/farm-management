"use client";
import { DataTable } from "@/components/datatable";

import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { UnitType } from "@prisma/client";
import { UnitsTableAction } from "./units-table-action";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { destroyMany } from "@/actions/unit";
import { toast } from "sonner";
import { UnitSuperscript } from "../../../_components/unit-with-value";
import { useDialog } from "@/stores/use-dialog";
import { UnitTable } from "@/types";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface UnitsTableProps {
  data: UnitTable[];
}
export const UnitsTable = ({ data }: UnitsTableProps) => {
  const t = useTranslations("units");
  const { onOpen, onClose, setPending } = useAlertDialog();
  const { onOpen: onOpenEdit } = useDialog();

  const { isSuperAdmin } = useCurrentStaffRole();
  const handleConfirm = (rows: UnitTable[]) => {
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
        toast.error("Internal error");
      })
      .finally(() => {
        onClose();
      });
  };
  const handleEdit = (data: UnitTable) => {
    onOpenEdit("unit.edit", { unit: data });
  };

  const columns: ColumnDef<UnitTable>[] = [
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
      cell: ({ row }) => {
        const data = row.original;
        return <UnitSuperscript unit={data.name} />;
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
        return t(`schema.type.options.${data.type}`);
      },
    },
    {
      accessorKey: "description",
      header: t("table.thead.description"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <UnitsTableAction data={data} />;
      },
    },
  ];

  const bulkActions = [
    {
      label: t("form.destroyMany.label"),
      action: (rows: UnitTable[]) => {
        onOpen({
          title: t("form.destroyMany.title"),
          description: t("form.destroyMany.description"),
          onConfirm: () => handleConfirm(rows),
        });
      },
      disabled: !isSuperAdmin,
    },
  ];
  const facetedFilters = [
    {
      column: "type",
      label: t("search.faceted.type.placeholder"),
      options: Object.values(UnitType).map((item) => {
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
