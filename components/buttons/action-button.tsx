"use client";

import { useAlertDialog } from "@/stores/use-alert-dialog";
import { Button, buttonVariants } from "../ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { ActionResponse } from "@/types";
import { VariantProps } from "class-variance-authority";

interface ActionButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string;
  label: string;
  title: string;
  description: string;
  actionFn: () => Promise<ActionResponse>;
  disabled?: boolean;
}
export const ActionButton = ({
  className,
  size,
  variant,
  description,
  label,
  title,
  disabled,
  actionFn,
}: ActionButtonProps) => {
  const { onOpen, setPending, isPending, onClose } = useAlertDialog();
  const onClick = () => {
    setPending(true);
    actionFn()
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
          onConfirm: () => onClick(),
        });
      }}
      disabled={isPending || disabled}
    >
      <Check className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
