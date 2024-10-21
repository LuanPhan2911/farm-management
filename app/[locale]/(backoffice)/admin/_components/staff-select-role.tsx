import { SelectData, SelectOptions } from "@/components/form/select-options";
import { StaffRole } from "@prisma/client";
import { useTranslations } from "next-intl";

interface StaffSelectRoleProps {
  placeholder: string;
  defaultValue?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  hidden?: StaffRole[];
}

export const StaffSelectRole = ({
  placeholder,
  onChange,
  defaultValue,
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
      placeholder={placeholder}
      options={options}
      onChange={onChange}
      defaultValue={defaultValue}
      disabled={disabled}
    />
  );
};
