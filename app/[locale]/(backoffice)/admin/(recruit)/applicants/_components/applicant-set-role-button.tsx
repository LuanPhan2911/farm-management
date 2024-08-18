"use client";

import { updateRole } from "@/actions/applicant";
import { DynamicDialog } from "@/components/dynamic-dialog";
import { SelectOptions } from "@/components/select-options";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/stores/use-dialog";
import { Roles } from "@/types";
import { Applicant } from "@prisma/client";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface ApplicantSetRoleButtonProps {
  data: Applicant;
  label: string;
}
export const ApplicantSetRoleButton = ({
  data,
  label,
}: ApplicantSetRoleButtonProps) => {
  const { onOpen } = useDialog();

  return (
    <Button
      className="w-full"
      onClick={() =>
        onOpen("applicant.setRole", {
          applicant: data,
        })
      }
    >
      <Edit className="h-6 w-6 mr-2" />
      {label}
    </Button>
  );
};
export const ApplicantSetRoleDialog = () => {
  const { isOpen, data, type, onClose } = useDialog();
  const tSetRole = useTranslations("applicants.form.setRole");
  const isOpenDialog = isOpen && type === "applicant.setRole";
  const [isPending, startTransition] = useTransition();
  const tForm = useTranslations("form");
  const [role, setRole] = useState<Roles>("farmer");
  const handleSetRole = () => {
    if (!data.applicant?.id) {
      return;
    }
    const applicantId = data.applicant.id;
    startTransition(() => {
      updateRole(applicantId, role)
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
    });
  };
  const options: { label: string; option: Roles }[] = [
    {
      label: "Admin",
      option: "admin",
    },
    {
      label: "Farmer",
      option: "farmer",
    },
  ];

  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={tSetRole("title")}
      description={tSetRole("description")}
    >
      <SelectOptions
        label="Select role"
        options={options}
        onChange={(value) => {
          setRole(value as Roles);
        }}
        value={role}
      />
      <div className="flex gap-x-2 justify-end">
        <Button variant="secondary" onClick={onClose}>
          {tForm("button.close")}
        </Button>
        <Button disabled={isPending} onClick={handleSetRole}>
          {tForm("button.submit")}
        </Button>
      </div>
    </DynamicDialog>
  );
};
