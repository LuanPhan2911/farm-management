"use client";

import { togglePublished } from "@/actions/job";
import { Switch } from "@/components/ui/switch";
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
  const onToggle = (value: boolean) => {
    if (!id) {
      return;
    }
    startTransition(() => {
      togglePublished(id, value)
        .then(({ message }) => {
          toast.success(message);
        })
        .catch((error: Error) => {
          toast.error(error.message);
        });
    });
  };
  return <Switch checked={published} onCheckedChange={onToggle} />;
};
