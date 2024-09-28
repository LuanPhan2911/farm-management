import { SelectData, SelectOptions } from "@/components/form/select-options";
import { StaffRole } from "@prisma/client";
import { useTranslations } from "next-intl";

interface StaffSelectRoleProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hidden?: StaffRole[];
}

export const StaffSelectRole = ({
  label,
  onChange,
  value,
  disabled,
  hidden,
}: StaffSelectRoleProps) => {
  const t = useTranslations("staffs.schema.role.options");
  const options: SelectData[] = Object.values(StaffRole)
    .map((item) => {
      return {
        label: t(`${item}`),
        value: item,
      };
    })
    .filter((item) => !hidden?.includes(item.value));
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
