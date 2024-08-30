"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export type SelectData = {
  option: string;
  label: string;
};
interface SelectOptionsProps {
  label: string;
  value: string | undefined;
  options: SelectData[];
  onChange: (value: string) => void;
  disabled?: boolean;
}
export const SelectOptions = ({
  onChange,
  value,
  options,
  label,
  disabled,
}: SelectOptionsProps) => {
  const handleChange = (currentValue: string) => {
    onChange(currentValue === value ? "" : currentValue);
  };
  return (
    <Select
      onValueChange={handleChange}
      defaultValue={value}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>

      <SelectContent>
        {options.map(({ label, option }) => {
          return (
            <SelectItem key={option} value={option}>
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
