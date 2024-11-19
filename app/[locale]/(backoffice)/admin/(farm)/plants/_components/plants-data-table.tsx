"use client";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { PlantTable } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { UserAvatar } from "@/components/user-avatar";

import { DataTable } from "@/components/datatable";

import { FertilizerType, Season } from "@prisma/client";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { SelectItemContent } from "@/components/form/select-item";
import { UnitWithValue } from "../../../_components/unit-with-value";
import { PlantSeasonValue } from "./plant-status-value";
import { FertilizerTypeValue } from "../../fertilizers/_components/fertilizer-status-value";

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
        return (
          <SelectItemContent
            imageUrl={data.imageUrl}
            title={data.name}
            description={data.category.name}
          />
        );
      },
    },

    {
      accessorKey: "season",
      header: t("table.thead.season"),
      cell: ({ row }) => {
        const data = row.original;
        return <PlantSeasonValue value={data.season || undefined} />;
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
        return <FertilizerTypeValue value={data.fertilizerType || undefined} />;
      },
    },
    {
      accessorKey: "growthDuration",
      header: t("table.thead.growthDuration"),
    },
    {
      accessorKey: "idealTemperature",
      header: () => (
        <p className="text-right">{t("table.thead.idealTemperature")}</p>
      ),
      cell: ({ row }) => {
        const data = row.original;
        if (data.idealTemperature?.value) {
          return (
            <UnitWithValue
              value={data.idealTemperature.value}
              unit={data.idealTemperature.unit?.name}
            />
          );
        }
        return <p className="text-right">{t("table.trow.idealTemperature")}</p>;
      },
    },
    {
      accessorKey: "idealHumidity",
      header: () => (
        <p className="text-right">{t("table.thead.idealHumidity")}</p>
      ),
      cell: ({ row }) => {
        const data = row.original;
        if (data.idealHumidity?.value) {
          return (
            <UnitWithValue
              value={data.idealHumidity.value}
              unit={data.idealHumidity.unit?.name || "%"}
            />
          );
        }
        return <p className="text-right">{t("table.trow.idealHumidity")}</p>;
      },
    },
    {
      accessorKey: "waterRequirement",
      header: () => (
        <p className="text-right">{t("table.thead.waterRequirement")}</p>
      ),
      cell: ({ row }) => {
        const data = row.original;
        if (data.waterRequirement?.value) {
          return (
            <UnitWithValue
              value={data.waterRequirement.value}
              unit={data.waterRequirement.unit?.name}
            />
          );
        }
        return <p className="text-right">{t("table.trow.waterRequirement")}</p>;
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
