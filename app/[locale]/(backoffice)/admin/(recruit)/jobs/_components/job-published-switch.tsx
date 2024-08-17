"use client";

import { togglePublished } from "@/actions/job";
import { Switch } from "@/components/ui/switch";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
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
  const tForm = useTranslations("form");
  const onToggle = (value: boolean) => {
    if (!id) {
      return;
    }
    startTransition(() => {
      togglePublished(id, value)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(tForm("error"));
        });
    });
  };
  return (
    <Switch
      checked={published}
      onCheckedChange={onToggle}
      disabled={isPending}
    />
  );
};
