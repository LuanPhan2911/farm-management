"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type RadioData = {
  label: string;
  value: string;
};
interface RadioOptionsProps {
  value: string;
  onChange: (value: string) => void;
  options: RadioData[];
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
      {options.map(({ label, value }) => {
        return (
          <div className="flex items-center space-x-2" key={value}>
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value}>{label}</Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};
