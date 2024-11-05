"use client";

import { UserAvatar } from "../user-avatar";

interface SelectItemProps {
  imageUrl: string | null;
  title: string;
  description?: string | null | undefined;
}

export const SelectItemContent = ({
  imageUrl,
  title,
  description,
}: SelectItemProps) => {
  return (
    <div className="flex items-center gap-x-2">
      <UserAvatar src={imageUrl || undefined} className="rounded-full" />
      <div className="w-full">
        <div className="text-sm font-medium leading-none text-start">
          {title}
        </div>
        <p className="text-sm text-muted-foreground text-start">
          {description}
        </p>
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
      <div className="text-sm font-medium leading-none text-start">{title}</div>
      <p className="text-xs text-muted-foreground text-start">{description}</p>
    </div>
  );
};
