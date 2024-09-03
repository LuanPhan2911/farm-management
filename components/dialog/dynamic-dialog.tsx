"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useDialog } from "@/stores/use-dialog";

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
