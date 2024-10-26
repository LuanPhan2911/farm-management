import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
interface ErrorButtonProps {
  title: string;
  refresh: () => void;
  className?: string;
}
export const ErrorButton = ({
  refresh,
  title,
  className,
}: ErrorButtonProps) => {
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      type="button"
      onClick={() => refresh()}
      className={cn(
        "w-full lg:w-[200px] gap-x-2  flex items-center justify-center text-destructive",
        className
      )}
    >
      {title}
      <RefreshCcw className="h-4 w-4" />
    </Button>
  );
};
