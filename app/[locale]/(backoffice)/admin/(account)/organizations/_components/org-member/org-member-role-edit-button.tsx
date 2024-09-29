"use client";
import { OrgRole } from "@/types";
import { OrgMemberRole } from "./org-member-role";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { editMemberRole } from "@/actions/organization";

interface OrgMemberRoleEditButtonProps {
  userId: string | undefined;
  defaultRole: OrgRole;
}
export const OrgMemberRoleEditButton = ({
  defaultRole,
  userId,
}: OrgMemberRoleEditButtonProps) => {
  const [role, setRole] = useState(defaultRole);
  const t = useTranslations("organizations");
  const { onOpen, onClose, setPending } = useAlertDialog();
  const params = useParams<{
    orgId: string;
  }>();
  const onConfirm = useCallback(async () => {
    if (!userId) {
      return;
    }
    setPending(true);
    editMemberRole(userId, params.orgId, role)
      .then(({ message, ok }) => {
        if (ok) {
          onClose();
          toast.success(message);
        } else {
          toast.error(message);
        }
      })
      .catch(() => {
        toast.error(t("status.failure.editMemberRole"));
      })
      .finally(() => {
        onClose();
      });
  }, [userId, params, role, onClose, t]);
  useEffect(() => {
    if (defaultRole !== role) {
      onOpen({
        title: t("form.editMemberRole.title"),
        description: t("form.editMemberRole.description"),
        onConfirm,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, defaultRole, onOpen, onConfirm, t]);

  return (
    <OrgMemberRole
      value={defaultRole}
      onChange={(val) => setRole(val as OrgRole)}
    />
  );
};
