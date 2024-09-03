"use client";
import { DataTable } from "@/components/datatable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Unit, UnitType } from "@prisma/client";
import { UnitsTableAction } from "./units-table-action";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { destroyMany } from "@/actions/unit";
import { toast } from "sonner";
import { UnitCreateButton } from "./unit-create-button";
import { UnitSuperscript } from "../../../_components/unit-superscript";

interface UnitsTableProps {
  data: Unit[];
}
export const UnitsTable = ({ data }: UnitsTableProps) => {
  const t = useTranslations("units");
  const { onOpen, onClose } = useAlertDialog();

  const columns: ColumnDef<Unit>[] = [
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
      header: t("table.thead.type"),
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
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
      label: t("form.destroySelected.label"),
      action: (rows: Unit[]) => {
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
  const facetedFilters = [
    {
      column: "type",
      label: "Select type",
      options: Object.values(UnitType).map((item) => {
        return {
          label: item,
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
          <UnitCreateButton />
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
