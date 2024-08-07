import { Input } from "./ui/input";
import { Table } from "@tanstack/react-table";
interface DataTableFilterColumnProps<TData> {
  table: Table<TData>;
  placeholder: string;
  column: string;
}

export function DataTableFilterColumn<TData>({
  table,
  placeholder,
  column,
}: DataTableFilterColumnProps<TData>) {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(column)?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );
}
