"use client";

import { SelectOptions } from "@/components/form/select-options";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { OrgRole } from "@/types";
import { useTranslations } from "next-intl";

interface OrgMemberRoleSelectProps {
  value?: OrgRole;
  onChange: (value: OrgRole) => void;
  disabled?: boolean;
}

export const OrgMemberRoleSelect = ({
  value,
  disabled,
  onChange,
}: OrgMemberRoleSelectProps) => {
  const t = useTranslations("organizations.schema.member.role");
  const { isAdmin } = useCurrentStaffRole();
  const options: { label: string; value: OrgRole }[] = [
    {
      label: t("options.admin"),
      value: "org:admin",
    },
    {
      label: t("options.member"),
      value: "org:member",
    },
  ];
  return (
    <SelectOptions
      onChange={(value) => onChange(value as OrgRole)}
      options={options}
      placeholder={t("placeholder")}
      defaultValue={value}
      disabled={disabled}
      disabledValues={[...(isAdmin ? ["org:admin"] : [])]}
    />
  );
};
