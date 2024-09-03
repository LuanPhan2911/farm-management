import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
interface DataTableSearchColumnProps<TData> {
  table: Table<TData>;
  value: string;
  placeholder: string;
}

export function DataTableSearchColumn<TData>({
  table,
  value: column,
  placeholder,
}: DataTableSearchColumnProps<TData>) {
  return (
    <Input
      placeholder={placeholder}
      value={(table.getColumn(column)?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn(column)?.setFilterValue(event.target.value)
      }
      className="h-8 w-[150px] lg:w-[250px]"
    />
  );
}
