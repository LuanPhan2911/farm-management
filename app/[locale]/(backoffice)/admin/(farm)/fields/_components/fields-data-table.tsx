"use client";
import { DataTable } from "@/components/datatable";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";

import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { FieldTable } from "@/types";
import { UnitWithValue } from "../../../_components/unit-with-value";

import { SoilType } from "@prisma/client";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { UsageStatusValue } from "@/components/usage-status-value";

interface FieldsDataTableProps {
  data: FieldTable[];
}

export const FieldsDataTable = ({ data }: FieldsDataTableProps) => {
  const { push } = useRouterWithRole();
  const t = useTranslations("fields");

  const columns: ColumnDef<FieldTable>[] = [
    {
      accessorKey: "orgId",
      header: t("table.thead.orgId"),
      cell: ({ row }) => {
        const data = row.original;
        return <UsageStatusValue status={!!data.orgId} />;
      },
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
      header: t("table.thead.location"),

      cell: ({ row }) => {
        const data = row.original;
        if (!data.location) {
          return t("table.trow.location");
        }
        return data.location;
      },
    },

    {
      accessorKey: "soilType",
      header: t("table.thead.soilType"),
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
      header: () => {
        return <p className="text-right">{t("table.thead.area")}</p>;
      },
      cell: ({ row }) => {
        const data = row.original;
        if (!data.area) {
          return <p className="text-right">{t("table.trow.area")}</p>;
        }
        return <UnitWithValue value={data.area} unit={data.unit?.name} />;
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
