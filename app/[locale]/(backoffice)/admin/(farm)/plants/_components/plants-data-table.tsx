"use client";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { PlantTable } from "@/types";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { UserAvatar } from "@/components/user-avatar";
import { PlantsTableAction } from "./plants-table-action";

import { DataTable } from "@/components/datatable";

import { FertilizerType, Season } from "@prisma/client";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

interface PlantsDataTableProps {
  data: PlantTable[];
}
export const PlantsDataTable = ({ data }: PlantsDataTableProps) => {
  const t = useTranslations("plants");
  const router = useRouterWithRole();
  const columns: ColumnDef<PlantTable>[] = [
    {
      accessorKey: "imageUrl",
      header: t("table.thead.imageUrl"),
      cell: ({ row }) => {
        const data = row.original;
        return <UserAvatar src={data.imageUrl || undefined} />;
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
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.category")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        return data.category.name;
      },
    },
    {
      accessorKey: "season",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.season")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        if (!data.season) {
          return t("table.trow.season");
        }
        return t(`schema.season.options.${data.season}`);
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "fertilizerType",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.fertilizerType")}
          />
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
      cell: ({ row }) => {
        const data = row.original;
        if (!data.fertilizerType) {
          return t(`table.trow.fertilizerType`);
        }
        return t(`schema.fertilizerType.options.${data.fertilizerType}`);
      },
    },
    {
      accessorKey: "growthDuration",
      header: t("table.thead.growthDuration"),
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <PlantsTableAction data={data} />;
      },
    },
  ];
  const facetedFilters = [
    {
      column: "season",
      label: t("search.faceted.season.placeholder"),
      options: Object.values(Season).map((item) => {
        return {
          label: t(`schema.season.options.${item}`),
          value: item,
        };
      }),
    },
    {
      column: "fertilizerType",
      label: t("search.faceted.fertilizerType.placeholder"),
      options: Object.values(FertilizerType).map((item) => {
        return {
          label: t(`schema.fertilizerType.options.${item}`),
          value: item,
        };
      }),
    },
  ];
  const onViewDetail = (data: PlantTable) => {
    router.push(`plants/detail/${data.id}`);
  };
  return (
    <DataTable
      columns={columns}
      data={data}
      searchable={{
        value: "name",
        placeholder: t("search.placeholder"),
      }}
      onViewDetail={onViewDetail}
      facetedFilters={facetedFilters}
    />
  );
};
