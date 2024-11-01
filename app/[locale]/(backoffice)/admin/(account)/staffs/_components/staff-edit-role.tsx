"use client";

import { editRole } from "@/actions/staff";
import { DynamicDialog } from "@/components/dialog/dynamic-dialog";
import { Button } from "@/components/ui/button";
import { useDialog } from "@/stores/use-dialog";

import { User } from "@clerk/nextjs/server";
import { StaffRole } from "@prisma/client";

import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { StaffSelectRole } from "../../../_components/staff-select-role";

import { isSuperAdmin } from "@/lib/permission";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";

interface UserSetRoleProps {
  data: User;
  label: string;
}
export const StaffEditRoleButton = ({ data, label }: UserSetRoleProps) => {
  const { onOpen } = useDialog();
  const isSuperAdminRole = isSuperAdmin(data.publicMetadata.role as StaffRole);
  const { isSuperAdmin: canEdit } = useCurrentStaffRole();
  return (
    <Button
      className="w-full"
      onClick={(e) => {
        e.stopPropagation();
        onOpen("staff.editRole", {
          user: data,
        });
      }}
      variant={"success"}
      disabled={isSuperAdminRole || !canEdit}
    >
      <Edit className="h-4 w-4 mr-2" />
      {label}
    </Button>
  );
};
export const StaffEditRoleDialog = () => {
  const { isOpen, data, type, onClose } = useDialog();
  const t = useTranslations("staffs");
  const isOpenDialog = isOpen && type === "staff.editRole";
  const [isPending, startTransition] = useTransition();
  const [role, setRole] = useState<StaffRole>("admin");
  const { isAdmin } = useCurrentStaffRole();
  useEffect(() => {
    if (data.user) {
      const role = data.user.publicMetadata.role as StaffRole;
      setRole(role);
    }
  }, [data]);
  const onSubmit = () => {
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
        .catch(() => {
          toast.error("Internal error");
        })
        .finally(() => {
          onClose();
        });
    });
  };

  return (
    <DynamicDialog
      isOpen={isOpenDialog}
      title={t("form.editRole.title")}
      description={t("form.editRole.description")}
    >
      <StaffSelectRole
        placeholder={t("schema.role.placeholder")}
        onChange={(value) => {
          setRole(value as StaffRole);
        }}
        defaultValue={role}
        disabled={isPending}
        disabledValues={[
          ...(isAdmin ? [StaffRole.superadmin, StaffRole.admin] : []),
        ]}
      />

      <div className="flex gap-x-2 justify-end">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button disabled={isPending} onClick={onSubmit}>
          Submit
        </Button>
      </div>
    </DynamicDialog>
  );
};
