"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RadioOptionsProps {
  value: string;
  onChange: (value: string) => void;
  options: {
    label: string;
    option: string;
  }[];
  disabled?: boolean;
}
export const RadioOptions = ({
  onChange,
  options,
  value,
  disabled,
}: RadioOptionsProps) => {
  return (
    <RadioGroup
      defaultValue={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      {options.map(({ label, option }) => {
        return (
          <div className="flex items-center space-x-2" key={option}>
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option}>{label}</Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};
