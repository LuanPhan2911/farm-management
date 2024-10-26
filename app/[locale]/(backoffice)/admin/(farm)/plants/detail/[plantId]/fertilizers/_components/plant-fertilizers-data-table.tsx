"use client";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { PlantFertilizerTable } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { PlantFertilizersTableAction } from "./plant-fertilizers-table-action";

import { DataTable } from "@/components/datatable";
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { useDialog } from "@/stores/use-dialog";

interface PlantFertilizersDataTableProps {
  data: PlantFertilizerTable[];
}
export const PlantFertilizersDataTable = ({
  data,
}: PlantFertilizersDataTableProps) => {
  const t = useTranslations("plantFertilizers");
  const tSchema = useTranslations("fertilizers.schema");
  const { onOpen } = useDialog();

  const columns: ColumnDef<PlantFertilizerTable>[] = [
    {
      header: t("table.thead.fertilizer.name"),
      cell: ({ row }) => {
        const data = row.original;
        return data.fertilizer.name;
      },
    },

    {
      header: t("table.thead.fertilizer.type"),
      cell: ({ row }) => {
        const data = row.original;

        return tSchema(`type.options.${data.fertilizer.type}`);
      },
    },
    {
      header: t("table.thead.fertilizer.recommendedDosage"),
      cell: ({ row }) => {
        const data = row.original;

        if (!data.fertilizer.recommendedDosage?.value) {
          return t("table.trow.fertilizer.recommendedDosage");
        }
        return (
          <UnitWithValue
            value={data.fertilizer.recommendedDosage?.value}
            unit={data.fertilizer.recommendedDosage?.unit?.name}
          />
        );
      },
    },
    {
      accessorKey: "stage",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.stage")}
          />
        );
      },
    },
    {
      header: t("table.thead.dosage"),
      cell: ({ row }) => {
        const data = row.original;
        if (!data.dosage?.value) {
          return t("table.trow.dosage");
        }
        return (
          <UnitWithValue
            value={data.dosage?.value}
            unit={data.dosage?.unit?.name}
          />
        );
      },
    },
    {
      accessorKey: "note",
      header: t("table.thead.note"),
      cell: ({ row }) => {
        const data = row.original;
        return data.note ? data.note : t("table.trow.note");
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <PlantFertilizersTableAction data={data} />;
      },
    },
  ];

  const handleEdit = (data: PlantFertilizerTable) => {
    onOpen("plantFertilizer.edit", {
      plantFertilizer: data,
    });
  };
  return <DataTable columns={columns} data={data} onViewDetail={handleEdit} />;
};
