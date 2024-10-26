"use client";

import { Link } from "@/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface DetailButtonProps {
  label: string;
  disabled?: boolean;
  href: string;
  className?: string;
}
export const DetailButton = ({
  href,
  label,
  disabled,
  className,
}: DetailButtonProps) => {
  return (
    <Link
      href={href}
      className={cn(className)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Button
        variant={"cyan"}
        size={"sm"}
        disabled={disabled}
        className={cn(className)}
      >
        {label}
      </Button>
    </Link>
  );
};
