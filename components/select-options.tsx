"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
interface SelectOptionsProps {
  label: string;
  value: string;
  options: {
    option: string;
    label: string;
  }[];
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
  return (
    <Select onValueChange={onChange} defaultValue={value} disabled={disabled}>
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
