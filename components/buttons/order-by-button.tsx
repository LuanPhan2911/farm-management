"use client";

import { ArrowDownUp } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { getPostfixSortOrder, toggleSortOrder } from "@/lib/utils";

interface OrderByButtonProps {
  column: string;
  label: string;
  defaultValue?: string;
}
export const OrderByButton = ({
  defaultValue,
  column,
  label,
}: OrderByButtonProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = defaultValue
    ? `${column}_${defaultValue}`
    : `${column}_${getPostfixSortOrder(searchParams.get("orderBy") || "")}`;
  const router = useRouter();
  const handleClick = () => {
    const params = new URLSearchParams(searchParams);

    if (!params.get("orderBy")) {
      params.set("orderBy", value);
    } else {
      if (value === params.get("orderBy")) {
        params.set("orderBy", toggleSortOrder(value));
      } else {
        params.set("orderBy", value);
      }
    }
    router.replace(`${pathname}?${params}`);
  };
  return (
    <Button size={"sm"} variant={"ghost"} onClick={handleClick}>
      {label}
      <ArrowDownUp className="w-4 h-4 ml-2" />
    </Button>
  );
};
