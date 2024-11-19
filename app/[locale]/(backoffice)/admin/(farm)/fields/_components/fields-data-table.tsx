"use client";
import { DataTable } from "@/components/datatable";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";

import { ColumnDef } from "@tanstack/react-table";
import { useFormatter, useTranslations } from "next-intl";
import { FieldTable } from "@/types";
import { UnitWithValue } from "../../../_components/unit-with-value";

import { SoilType } from "@prisma/client";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { UsageStatusValue } from "@/components/usage-status-value";
import { SelectItemContent } from "@/components/form/select-item";
import { FieldSoilTypeValue } from "./field-soil-type-value";

interface FieldsDataTableProps {
  data: FieldTable[];
}

export const FieldsDataTable = ({ data }: FieldsDataTableProps) => {
  const { push } = useRouterWithRole();
  const t = useTranslations("fields");
  const { dateTime } = useFormatter();
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
        return <FieldSoilTypeValue value={data.soilType} />;
      },
    },
    {
      accessorKey: "organization",
      header: t("table.thead.orgId"),
      cell: ({ row }) => {
        const { organization } = row.original;
        if (!organization) {
          return <UsageStatusValue status={false} />;
        }
        return (
          <SelectItemContent
            imageUrl={organization.imageUrl}
            title={organization.name}
            description={organization.slug}
          />
        );
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

    {
      accessorKey: "createdAt",
      header: t("table.thead.createdAt"),

      cell: ({ row }) => {
        const data = row.original;
        return dateTime(data.createdAt, "long");
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
