"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { safeParseJSON } from "@/lib/utils";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
import { useState } from "react";

export type OrderValue = Record<string, "asc" | "desc">;
interface OrderByButtonProps {
  column: string;
  label: string;
  defaultValue?: "desc" | "asc";
}
export const OrderByButton = ({
  defaultValue,
  column,
  label,
}: OrderByButtonProps) => {
  const { updateSearchParam, initialParam } = useUpdateSearchParam(
    "orderBy",
    defaultValue
      ? JSON.stringify({
          [column]: defaultValue,
        })
      : undefined
  );
  const orderValue = safeParseJSON<OrderValue>(initialParam);
  const [value, setValue] = useState(() => {
    return orderValue ? orderValue[column] : defaultValue || "desc";
  });
  const handleClick = () => {
    const updatedOrderValue: OrderValue = {};

    const toggleValue = value === "desc" ? "asc" : "desc";
    updatedOrderValue[column] = toggleValue;
    updateSearchParam(JSON.stringify(updatedOrderValue));
    setValue(toggleValue);
  };
  return (
    <Button size={"sm"} variant={"ghost"} onClick={handleClick} className="p-0">
      {label}
      {value === "desc" ? (
        <ArrowDown className="h-4 w-4 ml-2" />
      ) : (
        <ArrowUp className="h-4 w-4 ml-2" />
      )}
    </Button>
  );
};
