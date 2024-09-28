"use client";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useSheet } from "@/stores/use-sheet";
import { Button } from "../ui/button";

type Props = {
  title: React.ReactNode | string;
  description: string;
  children: React.ReactNode;
  isOpen: boolean;
  className?: string;
  side?: "top" | "bottom" | "left" | "right" | null | undefined;
};

export const DynamicSheet = ({
  title,
  description,
  children,
  isOpen,
  className,
  side,
}: Props) => {
  const { onClose } = useSheet();
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className={className} side={side}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        {children}
      </SheetContent>
    </Sheet>
  );
};

interface DynamicSheetFooterProps {
  disabled?: boolean;
  closeButton?: boolean;
}
export const DynamicSheetFooter = ({
  disabled,
  closeButton = true,
}: DynamicSheetFooterProps) => {
  const { onClose } = useSheet();
  return (
    <div className="flex items-center justify-center gap-2 p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
      {closeButton && (
        <SheetClose asChild>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={disabled}
          >
            Close
          </Button>
        </SheetClose>
      )}

      <Button type="submit" disabled={disabled} variant={"blue"}>
        Submit
      </Button>
    </div>
  );
};
