"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/stores/use-dialog";
import { Button } from "../ui/button";

type Props = {
  title: React.ReactNode | string;
  description: string;
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
};

export const DynamicDialog = ({
  title,
  description,
  children,
  isOpen,
  className,
}: Props) => {
  const { onClose } = useDialog();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {children}
      </DialogContent>
    </Dialog>
  );
};

interface DynamicDialogFooterProps {
  disabled?: boolean;
  closeButton?: boolean;
}
export const DynamicDialogFooter = ({
  disabled,
  closeButton = true,
}: DynamicDialogFooterProps) => {
  const { onClose } = useDialog();
  return (
    <div className="flex items-center justify-center gap-2 p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
      {closeButton && (
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={disabled}
        >
          Close
        </Button>
      )}

      <Button type="submit" disabled={disabled} variant={"blue"}>
        Submit
      </Button>
    </div>
  );
};
