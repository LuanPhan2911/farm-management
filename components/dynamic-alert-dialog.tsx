"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

export const DynamicAlertDialog = () => {
  const { isOpen, onClose, data } = useAlertDialog();
  const [isPending, startTransition] = useTransition();
  const tButton = useTranslations("form.button");
  if (!data) {
    return null;
  }
  const { description, onConfirm, title } = data;
  const handleClick = () => {
    startTransition(() => {
      onConfirm();
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {tButton("close")}
          </AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={handleClick}>
            {tButton("confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
