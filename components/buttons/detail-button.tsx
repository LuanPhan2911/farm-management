"use client";

import { Link } from "@/navigation";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { usePrefix } from "@/hooks/use-prefix";

interface DetailButtonProps extends VariantProps<typeof buttonVariants> {
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
  size,
  variant,
}: DetailButtonProps) => {
  const prefix = usePrefix();
  return (
    <Link
      href={prefix ? `${prefix}/${href}` : href}
      className={cn(className)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Button
        variant={variant || "cyan"}
        size={size || "sm"}
        disabled={disabled}
        className={cn(className)}
      >
        {label}
      </Button>
    </Link>
  );
};
