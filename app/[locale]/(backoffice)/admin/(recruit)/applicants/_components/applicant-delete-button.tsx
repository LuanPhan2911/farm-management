"use client";
import { destroy } from "@/actions/applicant";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { ApplicantTable } from "@/types";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

interface ApplicantDeleteButtonProps {
  data: ApplicantTable;
  label: string;
}
export const ApplicantDeleteButton = ({
  data,
  label,
}: ApplicantDeleteButtonProps) => {
  const { id } = data;
  const { onOpen, onClose, setPending } = useAlertDialog();

  const t = useTranslations("applicants");
  const onConfirm = async () => {
    setPending(true);
    destroy(id)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error(t("status.failure.destroy"));
      })
      .finally(() => {
        onClose();
      });
  };
  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen({
          title: t("form.destroy.title"),
          description: t("form.destroy.description"),
          onConfirm,
        });
      }}
      variant={"destroy"}
    >
      <Trash className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
