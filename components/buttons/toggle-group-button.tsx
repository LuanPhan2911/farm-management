"use client";

import { LucideIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Hint } from "@/components/hint";

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
              <Icon className="h-4 w-4" />
            </ToggleGroupItem>
          </Hint>
        );
      })}
    </ToggleGroup>
  );
};
