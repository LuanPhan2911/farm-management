"use client";

import { ActionResponse } from "@/types";
import { VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EditStatusButton extends VariantProps<typeof buttonVariants> {
  isButton?: boolean;
  editValueFn: () => Promise<ActionResponse>;
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
  className?: string;
}
export const EditStatusButton = ({
  isButton = false,
  editValueFn,
  label,
  className,
  disabled,
  icon: Icon,
  size,
  variant,
}: EditStatusButton) => {
  const onClick = () => {
    editValueFn()
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error("Internal error");
      });
  };
  if (isButton) {
    return (
      <Button
        className={className}
        variant={variant || "outline"}
        size={size || "sm"}
        onClick={onClick}
        disabled={disabled}
      >
        <Icon className="h-4 w-4 mr-2" />
        {label}
      </Button>
    );
  }
  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(className)}
      disabled={disabled}
    >
      <Icon className="w-4 h-4 " />
    </Button>
  );
};
