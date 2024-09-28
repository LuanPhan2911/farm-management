"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAlertDialog } from "@/stores/use-alert-dialog";
import { Button } from "../ui/button";

export const DynamicAlertDialog = () => {
  const { isOpen, onClose, data, isPending } = useAlertDialog();
  if (!data) {
    return null;
  }
  const { description, onConfirm, title } = data;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant={"outline"} disabled={isPending} onClick={onClose}>
            Close
          </Button>
          <Button variant={"cyan"} disabled={isPending} onClick={onConfirm}>
            {isPending ? "Processing..." : "Confirm"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
