"use client";
import { DataTable } from "@/components/datatable";

import { useFormatter, useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { EquipmentDetailsTableAction } from "./equipment-details-table-action";

import { EquipmentDetailTable } from "@/types";
import { UserAvatar } from "@/components/user-avatar";
import { EquipmentDetailStatusValue } from "./equipment-detail-status-value";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { UnitWithValue } from "@/app/[locale]/(backoffice)/admin/_components/unit-with-value";
import { SelectItemContent } from "@/components/form/select-item";

interface EquipmentDetailsTableProps {
  data: EquipmentDetailTable[];
}
export const EquipmentDetailsTable = ({ data }: EquipmentDetailsTableProps) => {
  const t = useTranslations("equipmentDetails");

  const router = useRouterWithRole();
  const { dateTime, number } = useFormatter();
  const handleViewUsage = (data: EquipmentDetailTable) => {
    router.push(
      `equipments/detail/${data.equipmentId}/details/${data.id}/usages`
    );
  };

  const columns: ColumnDef<EquipmentDetailTable>[] = [
    {
      id: "imageUrl",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.equipment.imageUrl")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        return (
          <SelectItemContent
            imageUrl={data.equipment.imageUrl}
            title={data.name || data.equipment.name}
            description={data.location}
          />
        );
      },
    },

    {
      accessorKey: "status",
      header: t("table.thead.status"),
      cell: ({ row }) => {
        const data = row.original;
        return <EquipmentDetailStatusValue status={data.status} />;
      },
    },

    {
      accessorKey: "lastMaintenanceDate",
      header: t("table.thead.lastMaintenanceDate"),
      cell: ({ row }) => {
        const data = row.original;
        if (!data.lastMaintenanceDate) {
          return t("table.trow.lastMaintenanceDate");
        }
        return dateTime(data.lastMaintenanceDate, "long");
      },
    },
    {
      accessorKey: "energyType",
      header: t("table.thead.energyType"),
      cell: ({ row }) => {
        const data = row.original;
        if (!data.energyType) {
          return t("table.trow.energyType");
        }
        return data.energyType;
      },
    },
    {
      accessorKey: "maxOperatingHours",
      header: () => (
        <p className="text-right">{t("table.thead.maxOperatingHours")}</p>
      ),
      cell: ({ row }) => {
        const data = row.original;

        return (
          <p className="text-right">{number(data.maxOperatingHours, "hour")}</p>
        );
      },
    },
    {
      accessorKey: "operatingHours",
      header: () => (
        <p className="text-right">{t("table.thead.operatingHours")}</p>
      ),
      cell: ({ row }) => {
        const data = row.original;

        return (
          <p className="text-right">{number(data.operatingHours, "hour")}</p>
        );
      },
    },

    {
      accessorKey: "maxFuelConsumption",
      header: () => (
        <p className="text-right">{t("table.thead.maxFuelConsumption")}</p>
      ),
      cell: ({ row }) => {
        const data = row.original;
        if (!data.maxFuelConsumption) {
          return (
            <p className="text-right">{t("table.trow.maxFuelConsumption")}</p>
          );
        }
        return (
          <UnitWithValue
            value={data.maxFuelConsumption}
            unit={data.unit?.name}
          />
        );
      },
    },
    {
      accessorKey: "baseFuelPrice",
      header: () => (
        <p className="text-right">{t("table.thead.baseFuelPrice")}</p>
      ),
      cell: ({ row }) => {
        const data = row.original;
        if (!data.baseFuelPrice) {
          return <p className="text-right">{t("table.trow.baseFuelPrice")}</p>;
        }
        return (
          <p className="text-right">{number(data.baseFuelPrice, "currency")}</p>
        );
      },
    },

    {
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <EquipmentDetailsTableAction data={data} />;
      },
    },
  ];

  return (
    <DataTable columns={columns} data={data} onViewDetail={handleViewUsage} />
  );
};
