"use client";

import { Link } from "@/navigation";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { usePrefix } from "@/hooks/use-prefix";
import { LucideIcon } from "lucide-react";

interface LinkButtonProps extends VariantProps<typeof buttonVariants> {
  label: string;
  disabled?: boolean;
  href: string;
  className?: string;
  icon?: LucideIcon;
}
export const LinkButton = ({
  href,
  label,
  disabled,
  className,
  size,
  variant,
  icon,
}: LinkButtonProps) => {
  const prefix = usePrefix();
  const Icon = icon ? icon : null;
  return (
    <Button
      variant={variant || "cyan"}
      size={size || "sm"}
      disabled={disabled}
      className={cn(className)}
      asChild
    >
      <Link
        href={prefix ? `${prefix}/${href}` : href}
        className={cn(className)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        {label}
      </Link>
    </Button>
  );
};
