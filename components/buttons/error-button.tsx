import { RefreshCcw } from "lucide-react";
import { Button } from "../ui/button";
interface ErrorButtonProps {
  title: string;
  refresh: () => void;
}
export const ErrorButton = ({ refresh, title }: ErrorButtonProps) => {
  return (
    <Button
      variant={"outline"}
      size={"sm"}
      type="button"
      onClick={() => refresh()}
      className="w-full gap-x-2 lg:w-[200px] flex items-center justify-center text-destructive"
    >
      {title}
      <RefreshCcw className="h-4 w-4" />
    </Button>
  );
};
