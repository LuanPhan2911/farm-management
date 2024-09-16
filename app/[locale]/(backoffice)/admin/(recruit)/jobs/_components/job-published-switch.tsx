"use client";

import { editPublished } from "@/actions/job";
import { Switch } from "@/components/ui/switch";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface JobPublishedSwitchProps {
  id: string;
  published: boolean;
}
export const JobPublishedSwitch = ({
  id,
  published,
}: JobPublishedSwitchProps) => {
  const [isPending, startTransition] = useTransition();
  const { onOpen } = useAlertDialog();

  const t = useTranslations("jobs");
  const onToggle = (newStatus: boolean) => {
    startTransition(() => {
      editPublished(id, newStatus)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.editPublished"));
        });
    });
  };

  return (
    <Switch
      checked={published}
      onCheckedChange={() => {
        onOpen({
          title: t("form.editPublished.title"),
          description: t("form.editPublished.description"),
          onConfirm: () => onToggle(!published),
          isPending,
        });
      }}
      disabled={isPending}
    />
  );
};
