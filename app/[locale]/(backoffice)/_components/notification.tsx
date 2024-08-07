import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import { NotificationItem } from "./notification-item";

export const Notification = () => {
  const t = useTranslations("dashboard.notification");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="relative">
          <Button size={"icon"} variant={"outline"}>
            <Bell />
          </Button>
          <div className="absolute -right-3 -top-3">
            <Badge variant="destructive">3</Badge>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[350px]"
        side="bottom"
        align="end"
        sideOffset={15}
      >
        <DropdownMenuLabel className="text-center text-md font-semibold">
          {t("title")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <NotificationItem />
        <NotificationItem />
        <NotificationItem />
        <DropdownMenuItem>
          <p className="text-muted-foreground text-sm text-center w-full">
            {t("none")}
          </p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
