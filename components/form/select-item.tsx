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
    <div className="flex items-center p-1 gap-x-2">
      <UserAvatar
        src={imageUrl || undefined}
        className="rounded-full"
        size={"sm"}
      />
      <div className="ml-4">
        <div className="text-sm font-medium leading-none text-start">
          {title}
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
