"use client";

import { LucideIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Hint } from "@/components/hint";

interface ToggleButtonProps {
  icon: LucideIcon;
  onToggle: () => void;
  label: string;
}
export const ToggleButton = ({
  icon: Icon,
  label,
  onToggle,
}: ToggleButtonProps) => {
  return (
    <Toggle onClick={onToggle} variant={"outline"}>
      <Hint label={label} asChild>
        <Icon className="h-6 w-6" />
      </Hint>
    </Toggle>
  );
};
