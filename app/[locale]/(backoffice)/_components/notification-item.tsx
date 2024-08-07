import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { UserAvatar } from "@/components/user-avatar";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";

export const NotificationItem = () => {
  const [removed, setRemoved] = useState(false);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setRemoved(true);
  };
  return (
    <DropdownMenuItem className={cn(removed && "hidden")}>
      <div
        className={cn(
          "flex items-center gap-x-4 bg-slate-300 w-full p-3 rounded-md transition-all"
        )}
      >
        <UserAvatar src="" />
        <div className="flex flex-col gap-y-2">
          <div className="text-muted-foreground text-sm truncate w-[200px]">
            Hello world..dsddddddddddd dddd dddddd ddddddd dddddddd
          </div>
          <div className="flex gap-x-2 items-center">
            <Badge variant={"default"}>
              <p className="text-[10px] text-nowrap">New order</p>
            </Badge>
            <p className="text-xs text-muted-foreground">2024-12-10 12:14PM</p>
          </div>
        </div>
        <Button size={"icon"} variant={"ghost"} onClick={handleClick}>
          <X className="w-4 h-4" />
        </Button>
      </div>
    </DropdownMenuItem>
  );
};
