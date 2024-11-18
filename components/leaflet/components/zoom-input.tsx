"use client";

import { Hint } from "@/components/hint";
import { Input } from "@/components/ui/input";

interface ZoomInputProps {
  defaultZoom?: number;
}
export const ZoomInput = ({ defaultZoom }: ZoomInputProps) => {
  return (
    <Hint asChild label="Zoom" side="bottom">
      <Input
        defaultValue={defaultZoom}
        type="number"
        className="no-spinners border-0 focus-visible:ring-0 focus-visible:ring-offset-0
        w-10 h-10"
      />
    </Hint>
  );
};
