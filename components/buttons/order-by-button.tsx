"use client";

import { ArrowDownUp } from "lucide-react";
import { Button } from "../ui/button";
import { getPostfixSortOrder, toggleSortOrder } from "@/lib/utils";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";

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
    defaultValue ? `${column}_${defaultValue}` : undefined
  );

  const handleClick = () => {
    const value = `${column}_${getPostfixSortOrder(initialParam, "desc")}`;
    if (initialParam === value) {
      updateSearchParam(toggleSortOrder(value));
    } else {
      updateSearchParam(value);
    }
  };
  return (
    <Button size={"sm"} variant={"ghost"} onClick={handleClick}>
      {label}
      <ArrowDownUp className="w-4 h-4 ml-2" />
    </Button>
  );
};
