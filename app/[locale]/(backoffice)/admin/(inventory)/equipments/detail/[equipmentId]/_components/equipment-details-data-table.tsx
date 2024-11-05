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

interface EquipmentDetailsTableProps {
  data: EquipmentDetailTable[];
}
export const EquipmentDetailsTable = ({ data }: EquipmentDetailsTableProps) => {
  const t = useTranslations("equipmentDetails");

  const router = useRouterWithRole();
  const { dateTime } = useFormatter();
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
        return <UserAvatar src={data.equipment.imageUrl || undefined} />;
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
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.status")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        return <EquipmentDetailStatusValue status={data.status} />;
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
      cell: ({ row }) => {
        const data = row.original;
        if (!data.location) {
          return t("table.trow.location");
        }
        return data.location;
      },
    },
    {
      accessorKey: "maintenanceSchedule",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.maintenanceSchedule")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        if (!data.maintenanceSchedule) {
          return t("table.trow.maintenanceSchedule");
        }
        return data.maintenanceSchedule;
      },
    },
    {
      accessorKey: "lastMaintenanceDate",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.lastMaintenanceDate")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        if (!data.lastMaintenanceDate) {
          return t("table.trow.lastMaintenanceDate");
        }
        return dateTime(data.lastMaintenanceDate, "short");
      },
    },
    {
      accessorKey: "operatingHours",
      header: ({ column }) => {
        return (
          <DataTableColumnHeader
            column={column}
            title={t("table.thead.operatingHours")}
          />
        );
      },
      cell: ({ row }) => {
        const data = row.original;
        if (!data.operatingHours) {
          return t("table.trow.operatingHours");
        }
        return data.operatingHours;
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
