import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
interface ErrorButtonProps {
  title: string;
  refresh: () => void;
}
export const ErrorButton = ({ refresh, title }: ErrorButtonProps) => {
  return (
    <div
      className="w-full h-10 text-sm text-destructive border 
  rounded-md px-2 flex items-center justify-center gap-x-2 lg:w-[200px]"
    >
      {title}
      <Button
        variant={"link"}
        size={"sm"}
        type="button"
        onClick={() => refresh()}
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};
