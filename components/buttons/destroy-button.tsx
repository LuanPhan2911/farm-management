"use client";

import { useAlertDialog } from "@/stores/use-alert-dialog";
import { ActionResponse } from "@/types";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";

interface DestroyButtonProps {
  destroyFn: (id: string) => Promise<ActionResponse>;
  inltKey: string;
  id: string;
  disabled?: boolean;
  className?: string;
}
export const DestroyButton = ({
  inltKey,
  id,
  disabled,
  destroyFn,
  className,
}: DestroyButtonProps) => {
  const { onOpen, onClose, setPending } = useAlertDialog();
  const t = useTranslations(`${inltKey}.form`);
  const onConfirm = async () => {
    setPending(true);
    destroyFn(id)
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
      className={cn(className)}
      onClick={(e) => {
        e.stopPropagation();
        onOpen({
          title: t("destroy.title"),
          description: t("destroy.description"),
          onConfirm,
        });
      }}
      size={"sm"}
      variant={"destroy"}
      disabled={disabled}
    >
      <Trash className="h-4 w-4 mr-2" />
      {t("destroy.label")}
    </Button>
  );
};
