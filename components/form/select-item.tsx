"use client";

import { ReactNode } from "react";
import { UserAvatar } from "../user-avatar";

interface SelectItemProps {
  imageUrl: string | null;
  title: string;
  description?: string | null | undefined | ReactNode;
}

export const SelectItemContent = ({
  imageUrl,
  title,
  description,
}: SelectItemProps) => {
  return (
    <div className="flex items-center gap-x-2">
      <UserAvatar src={imageUrl || undefined} className="rounded-full" />
      <div className="flex flex-col">
        <div className="text-sm font-semibold leading-none text-start whitespace-nowrap">
          {title}
        </div>
        <div className="text-sm text-muted-foreground text-start">
          {description}
        </div>
      </div>
    </div>
  );
};
interface SelectItemContentWithoutImageProps {
  title: string;
  description?: string | null | undefined;
}
export const SelectItemContentWithoutImage = ({
  title,
  description,
}: SelectItemContentWithoutImageProps) => {
  return (
    <div className="w-full flex flex-col gap-y-1">
      <div className="text-sm font-semibold leading-none text-start">
        {title}
      </div>
      <div className="text-xs text-muted-foreground text-start">
        {description}
      </div>
    </div>
  );
};
