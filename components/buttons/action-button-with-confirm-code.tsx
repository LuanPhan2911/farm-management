"use client";

import { Button, buttonVariants } from "../ui/button";
import { Check, LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { ActionResponse } from "@/types";
import { VariantProps } from "class-variance-authority";
import { useDialogConfirmCode } from "@/stores/use-dialog-confirm-code";

interface ActionButtonWithConfirmCodeProps
  extends VariantProps<typeof buttonVariants> {
  className?: string;
  icon?: LucideIcon;
  label: string;
  title: string;
  description: string;
  actionFn: () => Promise<ActionResponse>;
  disabled?: boolean;
  confirmCode: string;
}

export const ActionButtonWithConfirmCode = ({
  className,
  size,
  variant,
  description,
  label,
  title,
  disabled,
  icon: Icon,
  confirmCode,
  actionFn,
}: ActionButtonWithConfirmCodeProps) => {
  const { onOpen, onClose, isPending, setPending } = useDialogConfirmCode();
  const DefaultIcon = Icon ? Icon : Check;

  const onConfirm = async () => {
    try {
      setPending(true);
      const { message, ok } = await actionFn();
      if (ok) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error("Internal error");
    } finally {
      onClose();
    }
  };

  return (
    <Button
      className={className}
      variant={variant || "blue"}
      size={size || "sm"}
      onClick={(e) => {
        e.stopPropagation();
        onOpen({
          title,
          description,
          confirmCode,
          onConfirm,
        });
      }}
      disabled={isPending || disabled}
    >
      <DefaultIcon className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
