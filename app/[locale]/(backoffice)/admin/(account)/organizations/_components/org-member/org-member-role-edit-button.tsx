"use client";
import { OrgRole } from "@/types";
import { OrgMemberRoleSelect } from "../../../../_components/org-member-role";
import { useContext, useState } from "react";
import { useParams } from "next/navigation";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { editMemberRole } from "@/actions/organization";
import { OrgContext } from "../org-tabs";

interface OrgMemberRoleEditButtonProps {
  userId: string | undefined;
  defaultRole: OrgRole;
}
export const OrgMemberRoleEditButton = ({
  defaultRole,
  userId,
}: OrgMemberRoleEditButtonProps) => {
  const [role, setRole] = useState(defaultRole);
  const t = useTranslations("organizations.form");
  const { onOpen, onClose, setPending } = useAlertDialog();
  const params = useParams<{
    orgId: string;
  }>();
  const onConfirm = (newRole: OrgRole) => {
    if (!userId) {
      return;
    }
    setPending(true);
    editMemberRole(userId, params!.orgId, newRole)
      .then(({ message, ok }) => {
        if (ok) {
          onClose();
          toast.success(message);
          setRole(newRole as OrgRole);
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
  };

  const { canManageMember, isCreated, isSelf } = useContext(OrgContext);

  const disabled = !canManageMember || isSelf(userId) || isCreated(userId);

  return (
    <OrgMemberRoleSelect
      value={role}
      disabled={disabled}
      onChange={(newRole) => {
        if (role !== newRole) {
          onOpen({
            title: t("editMemberRole.title"),
            description: t("editMemberRole.description"),
            onConfirm: () => onConfirm(newRole),
          });
        }
      }}
    />
  );
};
