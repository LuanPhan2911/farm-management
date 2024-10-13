"use client";
import { DataTable } from "@/components/datatable";

import { useFormatter, useTranslations } from "next-intl";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { EquipmentDetailsTableAction } from "./equipment-details-table-action";

import { useDialog } from "@/stores/use-dialog";
import { EquipmentDetailTable } from "@/types";
import { UserAvatar } from "@/components/user-avatar";
import { EquipmentDetailStatusValue } from "./equipment-detail-status-value";

interface EquipmentDetailsTableProps {
  data: EquipmentDetailTable[];
}
export const EquipmentDetailsTable = ({ data }: EquipmentDetailsTableProps) => {
  const t = useTranslations("equipmentDetails");

  const { onOpen } = useDialog();
  const { dateTime } = useFormatter();
  const handleEdit = (data: EquipmentDetailTable) => {
    onOpen("equipmentDetail.edit", { equipmentDetail: data });
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
          <UserAvatar src={data.equipment.imageUrl || undefined} size={"lg"} />
        );
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
        return dateTime(data.lastMaintenanceDate);
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
      id: "actions",
      cell: ({ row }) => {
        const data = row.original;
        return <EquipmentDetailsTableAction data={data} />;
      },
    },
  ];

  return <DataTable columns={columns} data={data} onViewDetail={handleEdit} />;
};
