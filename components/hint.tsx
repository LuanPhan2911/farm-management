import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const Hint = ({
  asChild,
  label,
  children,
  side,
  align,
  signOffset,
  alignOffset,
  disabled = false,
}: {
  asChild?: boolean;
  label: string;
  children: React.ReactNode;
  side?: "top" | "left" | "bottom" | "right";
  align?: "start" | "center" | "end";
  signOffset?: number;
  alignOffset?: number;
  disabled?: boolean;
}) => {
  if (disabled) {
    return children;
  }
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          sideOffset={signOffset}
          alignOffset={alignOffset}
        >
          <div className="text-sm font-semibold">{label}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
