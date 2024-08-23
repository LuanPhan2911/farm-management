import { SelectOptions } from "@/components/select-options";
import { StaffRole } from "@prisma/client";

interface SelectRoleProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const SelectRole = ({
  label,
  onChange,
  value,
  disabled,
}: SelectRoleProps) => {
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
    <SelectOptions
      label={label}
      options={options}
      onChange={onChange}
      value={value}
      disabled={disabled}
    />
  );
};
