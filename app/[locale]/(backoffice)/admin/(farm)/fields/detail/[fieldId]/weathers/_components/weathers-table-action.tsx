"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WeatherTable } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { WeatherEditButton } from "./weather-edit-button";
import { WeatherDeleteButton } from "./weather-delete-button";
import { WeatherConfirmButton } from "./weather-confirm-button";
import { WeatherPinnedButton } from "./weather-pinned-button";
interface WeathersTableActionProps {
  data: WeatherTable;
}
export const WeathersTableAction = ({ data }: WeathersTableActionProps) => {
  const t = useTranslations("weathers.form");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-fit">
        <DropdownMenuItem>
          <WeatherPinnedButton data={data} isButton />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <WeatherEditButton data={data} label={t("edit.label")} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <WeatherConfirmButton data={data} isButton />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <WeatherDeleteButton data={data} label={t("destroy.label")} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
