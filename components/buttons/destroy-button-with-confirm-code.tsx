"use client";

import { ActionResponse } from "@/types";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouterWithRole } from "@/hooks/use-router-with-role";
import { useDialogConfirmCode } from "@/stores/use-dialog-confirm-code";

interface DestroyButtonWithConfirmCodeProps {
  destroyFn: (id: string) => Promise<ActionResponse>;
  inltKey: string;
  id: string;
  disabled?: boolean;
  className?: string;
  redirectHref?: string;
  confirmCode: string;
}
export const DestroyButtonWithConfirmCode = ({
  inltKey,
  id,
  disabled,
  destroyFn,
  className,
  redirectHref,
  confirmCode,
}: DestroyButtonWithConfirmCodeProps) => {
  const { onOpen, onClose, setPending } = useDialogConfirmCode();
  const t = useTranslations(`${inltKey}.form`);
  const router = useRouterWithRole();
  const onConfirm = async () => {
    setPending(true);
    destroyFn(id)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
          if (redirectHref) {
            router.replace(redirectHref);
          }
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
          confirmCode,
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
