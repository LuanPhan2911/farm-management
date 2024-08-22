"use client";

import { editRole } from "@/actions/user";
import { DynamicDialog } from "@/components/dynamic-dialog";
import { SelectOptions } from "@/components/select-options";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/stores/use-dialog";

import { User } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";

import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface UserSetRoleProps {
  data: User;
  label: string;
}
export const UserSetRole = ({ data, label }: UserSetRoleProps) => {
  const { onOpen } = useDialog();

  return (
    <Button
      className="w-full"
      onClick={() =>
        onOpen("user.setRole", {
          user: data,
        })
      }
      variant={"success"}
    >
      <Edit className="h-6 w-6 mr-2" />
      {label}
    </Button>
  );
};
export const UserSetRoleDialog = () => {
  const { isOpen, data, type, onClose } = useDialog();

  const t = useTranslations("users");
  const isOpenDialog = isOpen && type === "user.setRole";
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<StaffRole>("farmer");
  const handleSetRole = () => {
    if (!data.user) {
      return;
    }
    const id = data.user.id;
    startTransition(() => {
      editRole(id, role)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.setRole"));
        })
        .finally(() => {
          onClose();
        });
    });
  };
  const options: { label: string; option: StaffRole }[] = [
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
      title={t("form.setRole.title")}
      description={t("form.setRole.description")}
    >
      <SelectOptions
        label="Select role"
        options={options}
        onChange={(value) => {
          setRole(value as StaffRole);
        }}
        value={role}
      />
      <div className="flex gap-x-2 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button disabled={isPending} onClick={handleSetRole}>
          Submit
        </Button>
      </div>
    </DynamicDialog>
  );
};
