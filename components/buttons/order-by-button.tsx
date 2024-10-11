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
  defaultValue = "desc",
  column,
  label,
}: OrderByButtonProps) => {
  const { updateSearchParam, initialParam } = useUpdateSearchParam("orderBy");
  const orderValue = safeParseJSON<OrderValue>(initialParam);
  const [value, setValue] = useState(() => {
    return orderValue ? orderValue[column] : defaultValue;
  });
  const handleClick = () => {
    const updatedOrderValue: OrderValue = {};

    const toggleValue = value === "desc" ? "asc" : "desc";
    updatedOrderValue[column] = toggleValue;
    updateSearchParam(JSON.stringify(updatedOrderValue));
    setValue(toggleValue);
  };
  return (
    <Button size={"sm"} variant={"ghost"} onClick={handleClick}>
      {value === "desc" ? (
        <ArrowDown className="h-4 w-4 mr-2" />
      ) : (
        <ArrowUp className="h-4 w-4 mr-2" />
      )}
      {label}
    </Button>
  );
};
