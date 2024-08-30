"use client";
import { UserAvatar } from "@/components/user-avatar";

interface OrgSelectItemProps {
  imageUrl: string | undefined;
  name: string;
}
export const OrgSelectItem = ({ imageUrl, name }: OrgSelectItemProps) => {
  return (
    <div className="flex items-center">
      <UserAvatar src={imageUrl} size={"default"} className="rounded-full" />
      <div className="ml-4 space-y-1">
        <p className="text-sm font-medium leading-none">{name}</p>
      </div>
    </div>
  );
};
