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
  const [status, setStatus] = useState(published);
  const t = useTranslations("jobs.status.failure");
  const onToggle = () => {
    startTransition(() => {
      editPublished(id, !published)
        .then(({ message, ok }) => {
          if (ok) {
            setStatus(!published);
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("editPublished"));
        });
    });
  };
  return (
    <Switch
      checked={status}
      onCheckedChange={() => {
        onOpen({
          title: "Published job",
          description: "Everyone can read",
          onConfirm: onToggle,
        });
      }}
      disabled={isPending}
    />
  );
};
