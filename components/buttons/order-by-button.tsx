"use client";

import { ArrowDownUp } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { getPostfixSortOrder, toggleSortOrder } from "@/lib/utils";
import { useEffect } from "react";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!defaultValue) {
      return;
    }
    const params = new URLSearchParams(searchParams);

    params.set("orderBy", `${column}_${defaultValue}`);
    router.replace(`${pathname}?${params}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue]);
  const router = useRouter();
  const handleClick = () => {
    const value = `${column}_${getPostfixSortOrder(
      searchParams.get("orderBy") || "",
      "desc"
    )}`;
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
