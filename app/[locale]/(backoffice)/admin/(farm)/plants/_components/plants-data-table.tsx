"use client";
import { DataTableColumnHeader } from "@/components/datatable/datatable-column-header";
import { PlantTable } from "@/types";
import { Checkbox } from "@radix-ui/react-checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { EnumValue } from "../../../_components/enum-value";
import { UserAvatar } from "@/components/user-avatar";
import { UnitWithValue } from "../../../_components/unit-with-value";
import { PlantsTableAction } from "./plants-table-action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/datatable";
import { PlantCreateButton } from "./plant-create-button";
import { useRouter } from "@/navigation";
import { FertilizerType, Season } from "@prisma/client";

interface PlantsDataTableProps {
  data: PlantTable[];
}
export const PlantsDataTable = ({ data }: PlantsDataTableProps) => {
  const t = useTranslations("plants");
  const router = useRouter();
  const columns: ColumnDef<PlantTable>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "imageUrl",
      header: t("table.thead.imageUrl"),
      cell: ({ row }) => {
        const data = row.original;
        return <UserAvatar src={data.imageUrl || undefined} size={"default"} />;
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
        return t(`schema.fertilizerType.options.${data.fertilizerType}`);
      },
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
    router.push(`/admin/plants/detail/${data.id}`);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("page.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end">
          <PlantCreateButton />
        </div>
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
      </CardContent>
    </Card>
  );
};
