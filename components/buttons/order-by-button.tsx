"use client";

import { ArrowDownUp } from "lucide-react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";

interface OrderByButtonProps {
  value: string;
}
export const OrderByButton = ({ value }: OrderByButtonProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    if (!params.get("orderBy")) {
      params.set("orderBy", value);
    } else {
      params.delete("orderBy");
    }
    router.replace(`${pathname}?${params}`);
  };
  return (
    <Button size={"sm"} variant={"outline"} onClick={handleClick}>
      <ArrowDownUp className="w-4 h-4" />
    </Button>
  );
};
