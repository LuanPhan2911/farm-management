"use client";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { PlantPesticideTable } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { PlantPesticidesTableAction } from "./plant-pesticides-table-action";

import { DataTable } from "@/components/datatable";
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { useDialog } from "@/stores/use-dialog";

interface PlantPesticidesDataTableProps {
  data: PlantPesticideTable[];
}
export const PlantPesticidesDataTable = ({
  data,
}: PlantPesticidesDataTableProps) => {
  const t = useTranslations("plantPesticides");
  const tSchema = useTranslations("pesticides.schema");
  const { onOpen } = useDialog();
  const columns: ColumnDef<PlantPesticideTable>[] = [
    {
      header: t("table.thead.pesticide.name"),
      cell: ({ row }) => {
        const data = row.original;
        return data.pesticide.name;
      },
    },

    {
      header: t("table.thead.pesticide.type"),
      cell: ({ row }) => {
        const data = row.original;

        return tSchema(`type.options.${data.pesticide.type}`);
      },
    },
    {
      header: t("table.thead.pesticide.recommendedDosage"),
      cell: ({ row }) => {
        const data = row.original;

        if (!data.pesticide.recommendedDosage?.value) {
          return t("table.trow.pesticide.recommendedDosage");
        }
        return (
          <UnitWithValue
            value={data.pesticide.recommendedDosage?.value}
            unit={data.pesticide.recommendedDosage?.unit?.name}
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
        return <PlantPesticidesTableAction data={data} />;
      },
    },
  ];

  const handleEdit = (data: PlantPesticideTable) => {
    onOpen("plantPesticide.edit", {
      plantPesticide: data,
    });
  };
  return <DataTable columns={columns} data={data} onViewDetail={handleEdit} />;
};
