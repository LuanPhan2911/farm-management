"use client";
import { DataTable } from "@/components/datatable";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { FieldCreateButton } from "./field-create-button";
import { FieldWithUnit } from "@/types";
import { FieldsTableAction } from "./fields-table-action";
import { UnitWithValue } from "../../../_components/unit-with-value";

interface FieldsDataTableProps {
  data: FieldWithUnit[];
}
export const FieldsDataTable = ({ data }: FieldsDataTableProps) => {
  const t = useTranslations("fields");
  const columns: ColumnDef<FieldWithUnit>[] = [
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
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.location")}
          />
        );
      },
    },
    {
      accessorKey: "height",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.height")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        return <UnitWithValue value={data.height} unit={data.unit?.name} />;
      },
    },
    {
      accessorKey: "width",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.width")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        return <UnitWithValue value={data.width} unit={data.unit?.name} />;
      },
    },
    {
      accessorKey: "area",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.area")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        const unit = data.unit?.name ? `${data.unit.name}2` : "";
        return <UnitWithValue value={data.area} unit={unit} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <FieldsTableAction data={data} />;
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
          <FieldCreateButton />
        </div>
        <DataTable
          columns={columns}
          data={data}
          searchable={{
            value: "name",
            placeholder: t("search.placeholder"),
          }}
        />
      </CardContent>
    </Card>
  );
};
