"use client";

import { Table } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Workflow } from "lucide-react";
import { useTranslations } from "next-intl";

interface DataTableBulkActionProps<TData> {
  table: Table<TData>;
  actions: {
    label: string;
    action: (rows: TData[]) => void;
  }[];
}
export function DataTableBulkAction<TData>({
  table,
  actions,
}: DataTableBulkActionProps<TData>) {
  const tBulkAction = useTranslations("datatable.bulkAction");
  const disabled = table.getSelectedRowModel().rows.length === 0;

  const handleClick = (callback: (rows: TData[]) => void) => {
    const rows = table.getSelectedRowModel().rows;
    const rawRows = rows.map((row) => row.original);
    callback(rawRows);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"sm"} disabled={disabled}>
          <Workflow className="h-4 w-4 mr-2" />
          {tBulkAction("label")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{tBulkAction("description")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((act) => {
          return (
            <DropdownMenuItem
              key={act.label}
              onClick={() => handleClick(act.action)}
            >
              {act.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
