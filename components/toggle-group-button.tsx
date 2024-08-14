"use client";

import { LucideIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Hint } from "./hint";
export interface ToggleButton {
  icon: LucideIcon;
  label: string;
  onToggle: () => void;
}
interface ToggleGroupButtonProps {
  toggleButtons: ToggleButton[];
  type?: "single" | "multiple";
  disabled?: boolean;
}
export const ToggleGroupButton = ({
  toggleButtons,
  type = "multiple",
  disabled,
}: ToggleGroupButtonProps) => {
  return (
    <ToggleGroup type={type} variant={"outline"}>
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
