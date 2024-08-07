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
}: {
  asChild?: boolean;
  label: string;
  children: React.ReactNode;
  side?: "top" | "left" | "bottom" | "right";
  align?: "start" | "center" | "end";
  signOffset?: number;
  alignOffset?: number;
}) => {
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
          <p className="text-sm font-semibold">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
