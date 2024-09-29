"use client";

import { editPublished } from "@/actions/job";
import { Switch } from "@/components/ui/switch";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { JobTable } from "@/types";
import { useTranslations } from "next-intl";

import { toast } from "sonner";

interface JobPublishedSwitchProps {
  data: JobTable;
}
export const JobPublishedSwitch = ({ data }: JobPublishedSwitchProps) => {
  const { onOpen, setPending, isPending, onClose } = useAlertDialog();

  const t = useTranslations("jobs");
  const onToggle = () => {
    setPending(true);
    editPublished(data.id, !data.published)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error(t("status.failure.editPublished"));
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <Switch
      checked={data.published}
      onClick={(e) => {
        e.stopPropagation();
        onOpen({
          title: t("form.editPublished.title"),
          description: t("form.editPublished.description"),
          onConfirm: () => onToggle(),
        });
      }}
      disabled={isPending}
    />
  );
};
