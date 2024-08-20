"use client";

import { updateRole } from "@/actions/user";
import { DynamicDialog } from "@/components/dynamic-dialog";
import { SelectOptions } from "@/components/select-options";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/stores/use-dialog";
import { Roles } from "@/types";
import { User } from "@clerk/nextjs/server";

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
    >
      <Edit className="h-6 w-6 mr-2" />
      {label}
    </Button>
  );
};
export const UserSetRoleDialog = () => {
  const { isOpen, data, type, onClose } = useDialog();
  const tSetRole = useTranslations("users.form.setRole");
  const isOpenDialog = isOpen && type === "user.setRole";
  const [isPending, startTransition] = useTransition();
  const tForm = useTranslations("form");
  const [role, setRole] = useState<Roles>("farmer");
  const handleSetRole = () => {
    if (!data.user) {
      return;
    }
    const id = data.user.id;
    startTransition(() => {
      updateRole(id, role)
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
