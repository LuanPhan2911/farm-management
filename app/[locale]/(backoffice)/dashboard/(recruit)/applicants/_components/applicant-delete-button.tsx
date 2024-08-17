"use client";
import { destroy } from "@/actions/applicant";
import { Button } from "@/components/ui/button";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { Applicant } from "@prisma/client";
import { Trash } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

interface ApplicantDeleteButtonProps {
  data: Applicant;
  label: string;
}
export const ApplicantDeleteButton = ({
  data,
  label,
}: ApplicantDeleteButtonProps) => {
  const { id } = data;
  const { onOpen, onClose } = useAlertDialog();
  const tDestroy = useTranslations("applicants.form.destroy");
  const tForm = useTranslations("form");
  const onConfirm = async () => {
    destroy(id)
      .then(({ message, ok }) => {
        if (ok) {
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch((error: Error) => {
        toast.error(tForm("error"));
      })
      .finally(() => {
        onClose();
      });
  };
  return (
    <Button
      className="w-full"
      onClick={() =>
        onOpen({
          title: tDestroy("title"),
          description: tDestroy("description"),
          onConfirm,
        })
      }
    >
      <Trash className="h-6 w-6 mr-2" />
      {label}
    </Button>
  );
};
