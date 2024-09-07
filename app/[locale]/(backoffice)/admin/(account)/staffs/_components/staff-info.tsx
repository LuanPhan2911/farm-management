"use client";
import { UserAvatar } from "@/components/user-avatar";
import { User } from "@clerk/nextjs/server";
import { useFormatter, useTranslations } from "next-intl";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { StaffDeleteButton } from "./staff-delele-button";
import { StaffEditRole } from "./staff-edit-role";
import { StaffMetadataRole } from "../../../_components/staff-metadata-role";
import { getEmailAddress, getFullName } from "@/lib/utils";

interface StaffInfoProps {
  data: User;
}
export const StaffInfo = ({ data }: StaffInfoProps) => {
  const t = useTranslations("staffs");
  const { relativeTime } = useFormatter();
  return (
    <div className="flex flex-col gap-y-2 justify-center py-5 p-3 relative">
      <UserAvatar src={data.imageUrl} size={"lg"} className="rounded-full" />
      <div className="flex flex-col gap-y-2">
        <div className="text-md font-semibold flex items-center gap-x-2">
          {getFullName(data)}
          <StaffMetadataRole metadata={data.publicMetadata} />
        </div>
        <p className="text-sm font-semibold">{getEmailAddress(data)}</p>
        <p className="text-sm">
          {t("table.thead.lastActiveAt")}:{" "}
          {data.lastActiveAt
            ? relativeTime(data.lastActiveAt)
            : t("table.trow.lastActiveAt")}
        </p>
        <p className="text-sm ">
          {t("table.thead.lastSignedInAt")}:{" "}
          {data.lastSignInAt
            ? relativeTime(data.lastSignInAt)
            : t("table.trow.lastSignedInAt")}
        </p>
      </div>
      <div className="text-sm">
        {t("table.thead.joinedAt")}:{" "}
        <span className="font-semibold">{relativeTime(data.createdAt)}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="absolute top-1 right-1" asChild>
          <Button variant={"purple"} size={"sm"}>
            <Settings />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <StaffEditRole data={data} label={t("form.editRole.label")} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <StaffDeleteButton data={data} label={t("form.destroy.label")} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
