"use client";

import { LucideIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Hint } from "@/components/hint";
import { useState } from "react";

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
  const [pressed, setPresses] = useState(false);
  const onPressed = (value: boolean) => {
    setPresses(value);
    onToggle();
  };
  return (
    <Toggle variant={"outline"} pressed={pressed} onPressedChange={onPressed}>
      <Hint label={label} asChild>
        <Icon className="h-6 w-6" />
      </Hint>
    </Toggle>
  );
};
