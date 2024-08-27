"use client";
interface OrgSelectProps {
  defaultValue: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}
export const OrgSelect = ({
  onChange,
  defaultValue,
  disabled,
}: OrgSelectProps) => {};
