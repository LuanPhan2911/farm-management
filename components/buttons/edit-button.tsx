"use client";

import { DialogData, DialogType, useDialog } from "@/stores/use-dialog";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface EditButtonProps {
  inltKey: string;
  type: DialogType;
  data?: DialogData;
  className?: string;
}
export const EditButton = ({
  data,
  type,
  inltKey,
  className,
}: EditButtonProps) => {
  const t = useTranslations(`${inltKey}.form`);
  const { onOpen } = useDialog();
  return (
    <Button
      className={cn(className)}
      onClick={(e) => {
        e.stopPropagation();
        onOpen(type, data);
      }}
      size={"sm"}
      variant={"edit"}
    >
      <Edit className="w-4 h-4 mr-2" />
      {t("edit.label")}
    </Button>
  );
};
