"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrgRole } from "@/types";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

interface OrgMemberRoleProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const OrgMemberRole = ({
  value,
  disabled,
  onChange,
}: OrgMemberRoleProps) => {
  const t = useTranslations("organizations.schema.member.role.options");
  const options: { label: string; value: OrgRole }[] = [
    {
      label: t("admin"),
      value: "org:admin",
    },
    {
      label: t("member"),
      value: "org:member",
    },
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="justify-start"
          disabled={disabled}
        >
          {options.find((option) => option.value === value)?.label ||
            "Select role"}
          <ChevronDown className="ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start">
        {options.map(({ label, value }) => {
          return (
            <DropdownMenuItem key={value} onClick={() => onChange(value)}>
              {label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
