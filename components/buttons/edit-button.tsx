"use client";

import { DialogData, DialogType, useDialog } from "@/stores/use-dialog";
import { Button, buttonVariants } from "../ui/button";
import { Edit, LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { VariantProps } from "class-variance-authority";

interface EditButtonProps extends VariantProps<typeof buttonVariants> {
  type: DialogType;
  data?: DialogData;
  className?: string;
  disabled?: boolean;
  icon?: LucideIcon;
  inltKey: string;
}

export const EditButton = ({
  data,
  type,
  className,
  disabled,
  size,
  variant,
  icon,
  inltKey,
}: EditButtonProps) => {
  const Icon = icon ? icon : Edit;
  const t = useTranslations(`${inltKey}.form`);
  const { onOpen } = useDialog();
  return (
    <Button
      className={cn(className)}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(type, data);
      }}
      size={size || "sm"}
      variant={variant || "edit"}
      disabled={disabled}
    >
      <Icon className="w-4 h-4 mr-2" />
      {t("edit.label")}
    </Button>
  );
};
