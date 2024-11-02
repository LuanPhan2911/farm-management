"use client";
import { DataTable } from "@/components/datatable";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { FieldTable } from "@/types";
import { FieldsTableAction } from "./fields-table-action";
import { UnitWithValue } from "../../../_components/unit-with-value";

import { SoilType } from "@prisma/client";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

interface FieldsDataTableProps {
  data: FieldTable[];
}

export const FieldsDataTable = ({ data }: FieldsDataTableProps) => {
  const { push } = useRouterWithRole();
  const t = useTranslations("fields");

  const columns: ColumnDef<FieldTable>[] = [
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
      accessorKey: "orgId",
      header: t("table.thead.orgId"),
      cell: ({ row }) => {
        const data = row.original;
        return data.orgId ? "O" : "U";
      },
    },
    {
      accessorKey: "soilType",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.soilType")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ row }) => {
        const data = row.original;
        if (!data.soilType) {
          return t("table.trow.soilType");
        }
        return t(`schema.soilType.options.${data.soilType}`);
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
      accessorKey: "shape",
      header: t("table.thead.shape"),
    },
    {
      accessorKey: "note",
      header: t("table.thead.note"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <FieldsTableAction data={data} />;
      },
    },
  ];
  const facetedFilters = [
    {
      column: "soilType",
      label: t("search.faceted.soilType.placeholder"),
      options: Object.values(SoilType).map((item) => {
        return {
          label: t(`schema.soilType.options.${item}`),
          value: item,
        };
      }),
    },
  ];
  const onViewDetail = (item: FieldTable) => {
    push(`fields/detail/${item.id}`);
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      searchable={{
        value: "name",
        placeholder: t("search.placeholder"),
      }}
      facetedFilters={facetedFilters}
      onViewDetail={onViewDetail}
    />
  );
};
