"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export type SelectData = {
  value: string;
  label: string;
};
interface SelectOptionsProps {
  placeholder: string;
  defaultValue?: string | null;
  options: SelectData[];
  onChange: (value: string) => void;
  disabled?: boolean;
  disabledValues?: string[];
}
export const SelectOptions = ({
  onChange,
  defaultValue,
  options,
  placeholder,
  disabled,
  disabledValues,
}: SelectOptionsProps) => {
  const handleChange = (currentValue: string) => {
    onChange(currentValue);
  };
  return (
    <Select
      onValueChange={handleChange}
      value={defaultValue || undefined}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map(({ label, value }) => {
          return (
            <SelectItem
              key={value}
              value={value}
              disabled={disabledValues?.includes(value)}
            >
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
