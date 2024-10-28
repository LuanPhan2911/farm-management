import { SelectData, SelectOptions } from "@/components/form/select-options";
import { StaffRole } from "@prisma/client";
import { useTranslations } from "next-intl";

interface StaffSelectRoleProps {
  placeholder: string;
  defaultValue?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  disabledValues?: StaffRole[];
}

export const StaffSelectRole = ({
  placeholder,
  onChange,
  defaultValue,
  disabled,
  disabledValues,
}: StaffSelectRoleProps) => {
  const t = useTranslations("staffs.schema.role.options");
  const options: SelectData[] = Object.values(StaffRole).map((item) => {
    return {
      label: t(`${item}`),
      value: item,
    };
  });
  return (
    <SelectOptions
      placeholder={placeholder}
      options={options}
      onChange={onChange}
      defaultValue={defaultValue}
      disabled={disabled}
      disabledValues={disabledValues}
    />
  );
};
