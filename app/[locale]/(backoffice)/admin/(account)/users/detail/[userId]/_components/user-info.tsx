"use client";
import { ClipboardButton } from "@/components/clipboard-button";
import { UserAvatar } from "@/components/user-avatar";
import { User } from "@clerk/nextjs/server";
import { useFormatter } from "next-intl";
import { UserDeleteButton } from "../../../_components/user-delete-button";
import { UserSetRole } from "./user-set-role";
import { UserMetadataRole } from "../../../_components/user-metadata-role";

interface UserInfoProps {
  data: User;
}
export const UserInfo = ({ data }: UserInfoProps) => {
  const { relativeTime } = useFormatter();
  const fullName =
    `${data.firstName || ""} ${data.lastName || ""}`.trim() || "No filled";
  const email = data.emailAddresses[0].emailAddress;
  const lastSignedIn = data.lastSignInAt
    ? relativeTime(data.lastSignInAt)
    : "never";
  return (
    <div className="flex flex-col gap-y-4 justify-center py-5 p-3 border rounded-lg shadow-md">
      <UserAvatar src={data.imageUrl} size={"lg"} className="rounded-full" />
      <div className="flex flex-col gap-y-2">
        <div className="text-md font-semibold flex items-center gap-x-2">
          {fullName}
          <UserMetadataRole metadata={data.publicMetadata} />
        </div>
        <p className="text-sm font-semibold">{email}</p>
        <p className="text-sm text-muted-foreground">
          Last signed in {lastSignedIn}
        </p>
      </div>
      <div className="flex gap-x-2 w-full items-center">
        <div className="truncate bg-blue-200 p-2 rounded-lg text-sm">
          <span className="font-semibold mr-2">UserId</span>
          <span className="text-muted-foreground ">{data.id}</span>
        </div>
        <ClipboardButton value={data.id} />
      </div>
      <div className="flex gap-x-2">
        <UserSetRole data={data} label="Set Role" />
        <UserDeleteButton data={data} label="Delete User" />
      </div>
      <div className="text-sm text-muted-foreground ">
        Joined on{" "}
        <span className="font-semibold">{relativeTime(data.createdAt)}</span>
      </div>
    </div>
  );
};
