import { SelectData, SelectOptions } from "@/components/form/select-options";
import { StaffRole } from "@prisma/client";

interface StaffSelectRoleProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const StaffSelectRole = ({
  label,
  onChange,
  value,
  disabled,
}: StaffSelectRoleProps) => {
  const options: SelectData[] = [
    {
      label: "Admin",
      value: "admin",
    },
    {
      label: "Farmer",
      value: "farmer",
    },
  ];
  return (
    <SelectOptions
      label={label}
      options={options}
      onChange={onChange}
      defaultValue={value}
      disabled={disabled}
    />
  );
};
