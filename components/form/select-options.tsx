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
  label: string;
  defaultValue?: string;
  options: SelectData[];
  onChange: (value: string) => void;
  disabled?: boolean;
}
export const SelectOptions = ({
  onChange,
  defaultValue,
  options,
  label,
  disabled,
}: SelectOptionsProps) => {
  const handleChange = (currentValue: string) => {
    onChange(currentValue);
  };
  return (
    <Select
      onValueChange={handleChange}
      defaultValue={defaultValue}
      disabled={disabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={label} />
      </SelectTrigger>

      <SelectContent>
        {options.map(({ label, value }) => {
          return (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
