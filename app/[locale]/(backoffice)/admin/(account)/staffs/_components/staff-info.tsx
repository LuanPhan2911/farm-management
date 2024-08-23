"use client";
import { UserAvatar } from "@/components/user-avatar";
import { User } from "@clerk/nextjs/server";
import { useFormatter } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { StaffDeleteButton } from "./staff-delele-button";
import { StaffEditRole } from "./staff-edit-role";
import { StaffMetadataRole } from "../../../_components/staff-metadata-role";

interface StaffInfoProps {
  data: User;
}
export const StaffInfo = ({ data }: StaffInfoProps) => {
  const { relativeTime } = useFormatter();
  const fullName =
    `${data.firstName || ""} ${data.lastName || ""}`.trim() || "No filled";
  const email = data.emailAddresses[0].emailAddress;
  const lastSignedIn = data.lastSignInAt
    ? relativeTime(data.lastSignInAt)
    : "never";
  return (
    <div className="flex flex-col gap-y-2 justify-center py-5 p-3 relative">
      <UserAvatar src={data.imageUrl} size={"lg"} className="rounded-full" />
      <div className="flex flex-col gap-y-2">
        <div className="text-md font-semibold flex items-center gap-x-2">
          {fullName}
          <StaffMetadataRole metadata={data.publicMetadata} />
        </div>
        <p className="text-sm font-semibold">{email}</p>
        <p className="text-sm text-muted-foreground">
          Last signed in {lastSignedIn}
        </p>
      </div>
      <div className="text-sm text-muted-foreground ">
        Joined on{" "}
        <span className="font-semibold">{relativeTime(data.createdAt)}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-1 right-1" asChild>
          <Button variant={"purple"} size={"sm"}>
            <Settings />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <StaffEditRole data={data} label="Edit role" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <StaffDeleteButton data={data} label="Delete User" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
