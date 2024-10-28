"use client";
import { UserAvatar } from "@/components/user-avatar";
import { User } from "@clerk/nextjs/server";
import { useFormatter, useTranslations } from "next-intl";

import { getEmailAddress, getFullName } from "@/lib/utils";

interface UserInfoProps {
  data: User;
}
export const UserInfo = ({ data }: UserInfoProps) => {
  const t = useTranslations("users");
  const { relativeTime } = useFormatter();

  return (
    <div className="flex flex-col gap-y-2 justify-center py-5 p-3 relative">
      <UserAvatar src={data.imageUrl} />
      <div className="flex flex-col gap-y-2">
        <div className="text-md font-semibold flex items-center gap-x-2">
          {getFullName(data)}
        </div>
        <p className="text-sm font-semibold">{getEmailAddress(data)}</p>
        <p className="text-sm text-muted-foreground">
          {t("table.thead.lastSignedInAt")}:{" "}
          {data.lastSignInAt
            ? relativeTime(data.lastSignInAt)
            : t("table.trow.lastSignedInAt")}
        </p>
        <p className="text-sm text-muted-foreground">
          {t("table.thead.lastActiveAt")}:{" "}
          {data.lastActiveAt
            ? relativeTime(data.lastActiveAt)
            : t("table.trow.lastActiveAt")}
        </p>
      </div>
      <div className="text-sm text-muted-foreground ">
        {t("table.thead.joinedAt")}:{" "}
        <span className="font-semibold">{relativeTime(data.createdAt)}</span>
      </div>
    </div>
  );
};
