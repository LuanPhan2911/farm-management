"use client";

import { useAlertDialog } from "@/stores/use-alert-dialog";
import { ActionResponse } from "@/types";
import { VariantProps } from "class-variance-authority";
import { Check, LucideIcon } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { toast } from "sonner";
import { Switch } from "../ui/switch";

interface ConfirmButtonProps extends VariantProps<typeof buttonVariants> {
  isButton?: boolean;
  checked: boolean;
  className?: string;
  icon?: LucideIcon;
  label: string;
  title: string;
  description: string;
  confirmFn: () => Promise<ActionResponse>;
  disabled?: boolean;
}
export const ConfirmButton = ({
  isButton = false,
  confirmFn,
  checked,
  description,
  label,
  title,
  className,
  disabled,
  icon,
  size,
  variant,
}: ConfirmButtonProps) => {
  const { onOpen, setPending, isPending, onClose } = useAlertDialog();
  const DefaultIcon = icon ? icon : Check;
  const onClick = () => {
    setPending(true);
    confirmFn()
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error("Internal error");
      })
      .finally(() => {
        onClose();
      });
  };
  if (isButton) {
    return (
      <Button
        className={className}
        variant={variant || "outline"}
        size={size || "sm"}
        onClick={(e) => {
          e.stopPropagation();
          onOpen({
            title,
            description,
            onConfirm: () => onClick(),
          });
        }}
        disabled={isPending || disabled}
      >
        <DefaultIcon className="h-4 w-4 mr-2" />
        {label}
      </Button>
    );
  }
  return (
    <Switch
      checked={checked}
      onClick={(e) => {
        e.stopPropagation();
        onOpen({
          title,
          description,
          onConfirm: () => onClick(),
        });
      }}
      disabled={isPending || disabled}
    />
  );
};
