"use client";

import { LucideIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Hint } from "./hint";
import { useState } from "react";
export interface ToggleButton {
  icon: LucideIcon;
  label: string;
  onToggle: () => void;
}
interface ToggleGroupButtonProps {
  toggleButtons: ToggleButton[];
  type: "multiple" | "single";
  disabled?: boolean;
}
export const ToggleGroupButton = ({
  toggleButtons,
  type,
  disabled,
}: ToggleGroupButtonProps) => {
  const [values, setValues] = useState<string[]>([]);
  const onChange = (values: string[]) => {
    console.log(values);

    setValues(values);
  };
  return (
    <ToggleGroup type={type}>
      {toggleButtons.map(({ icon: Icon, label, onToggle }) => {
        return (
          <Hint asChild label={label} key={label}>
            <ToggleGroupItem
              value={label}
              onClick={onToggle}
              variant={"outline"}
              disabled={disabled}
              size={"sm"}
            >
              <Icon className="h-6 w-6" />
            </ToggleGroupItem>
          </Hint>
        );
      })}
    </ToggleGroup>
  );
};
