"use client";

import { Link } from "@/navigation";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";
import { usePrefix } from "@/hooks/use-prefix";
import { LucideIcon } from "lucide-react";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

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
  const Icon = icon ? icon : null;
  const router = useRouterWithRole();
  return (
    <Button
      variant={variant || "cyan"}
      size={size || "sm"}
      disabled={disabled}
      className={cn(className)}
      onClick={(e) => {
        e.stopPropagation();
        router.push(href);
      }}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
    </Button>
  );
};
