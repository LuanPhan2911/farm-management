"use client";
import { editPinned } from "@/actions/weather";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { WeatherTable } from "@/types";
import { LucideIcon, Pin, PinOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { toast } from "sonner";

interface WeatherPinnedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  data: WeatherTable;
  isButton?: boolean;
}
export const WeatherPinnedButton = ({
  data,
  isButton = false,
  className,
}: WeatherPinnedButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations("weathers");
  const onSubmit = () => {
    startTransition(() => {
      editPinned(data.id, !data.pinned)
        .then(({ message, ok }) => {
          if (ok) {
            toast.success(message);
          } else {
            toast.error(message);
          }
        })
        .catch((error: Error) => {
          toast.error(t("status.failure.editPinned"));
        });
    });
  };
  const ICon: LucideIcon = data.pinned ? PinOff : Pin;
  if (isButton) {
    return (
      <Button
        className="w-full"
        variant={"purple"}
        size={"sm"}
        onClick={(e) => {
          e.stopPropagation();
          onSubmit();
        }}
        disabled={isPending}
      >
        <Pin className="h-4 w-4 mr-2" />
        {t("form.editPinned.label")}
      </Button>
    );
  }

  return (
    <Button
      size={"icon"}
      variant={"ghost"}
      onClick={(e) => {
        e.stopPropagation();
        onSubmit();
      }}
      className={cn(className)}
      disabled={isPending}
    >
      <ICon className="w-4 h-4 " />
    </Button>
  );
};
