"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationArrowProps {
  direction: "left" | "right";
  onClick: () => void;
  isDisabled: boolean;
}

export const PaginationArrow = ({
  direction,
  onClick,
  isDisabled,
}: PaginationArrowProps) => {
  const isLeft = direction === "left";

  return (
    <Button
      onClick={onClick}
      aria-disabled={isDisabled}
      disabled={isDisabled}
      variant={"blue"}
      size={"icon"}
    >
      {isLeft ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </Button>
  );
};
