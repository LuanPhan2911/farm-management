"use client";

import { Table } from "@tanstack/react-table";
import { DataTableSearchColumn } from "./datatable-search-column";
import { DataTableBulkAction } from "./datatable-bulk-action";
import { DataTableViewOptions } from "./datatable-view-options";
import { LucideIcon } from "lucide-react";
import { DataTableFacetedFilter } from "./datatable-faceted-filter";

interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>;
  searchable?: {
    value: string;
    placeholder: string;
  };
  bulkActions?: {
    label: string;
    action: (rows: TData[]) => void;
  }[];
  facetedFilters?: {
    column: string;
    label: string;
    options: {
      label: string;
      value: string;
      icon?: LucideIcon;
    }[];
  }[];
}
export function DataTableToolbar<TData, TValue>({
  table,
  bulkActions,
  searchable,
  facetedFilters,
}: DataTableToolbarProps<TData, TValue>) {
  return (
    <div className="flex py-4 lg:flex-row flex-col-reverse gap-4">
      <div className="flex gap-x-2">
        {searchable && <DataTableSearchColumn table={table} {...searchable} />}
        {facetedFilters?.map((item) => {
          return (
            <DataTableFacetedFilter
              key={item.label}
              column={table.getColumn(item.column)}
              title={item.label}
              options={item.options}
            />
          );
        })}
      </div>
      <div className="flex ml-auto gap-x-2">
        {bulkActions && (
          <DataTableBulkAction table={table} actions={bulkActions} />
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
