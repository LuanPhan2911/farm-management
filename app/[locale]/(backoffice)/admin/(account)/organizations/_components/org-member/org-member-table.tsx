"use client";
import { SearchBar } from "@/components/search-bar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/user-avatar";
import { OrgMemberAction } from "./org-member-action";
import { OrgMemberRoleEditButton } from "./org-member-role-edit-button";
import { OrgRole } from "@/types";
import { useFormatter, useTranslations } from "next-intl";
import { OrganizationMembership } from "@clerk/nextjs/server";
import { mergeName } from "@/lib/utils";

interface OrgMemberTableProps {
  data: OrganizationMembership[];
}
export const OrgMemberTable = ({ data }: OrgMemberTableProps) => {
  const t = useTranslations("organizations");
  const { relativeTime } = useFormatter();

  return (
    <>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center">
        <SearchBar
          placeholder={t("search.member.placeholder")}
          isPagination={false}
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{t("table.member.thead.name")}</TableHead>
            <TableHead>{t("table.member.thead.email")}</TableHead>
            <TableHead>{t("table.member.thead.role")}</TableHead>
            <TableHead>{t("table.member.thead.createdAt")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => {
            const { publicUserData, role, createdAt } = item;
            return (
              <TableRow key={publicUserData?.userId}>
                <TableCell>
                  <UserAvatar
                    src={publicUserData?.imageUrl || undefined}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>
                  {mergeName(
                    publicUserData?.firstName,
                    publicUserData?.lastName
                  )}
                </TableCell>

                <TableCell>{publicUserData?.identifier}</TableCell>
                <TableCell>
                  <OrgMemberRoleEditButton
                    defaultRole={role as OrgRole}
                    userId={publicUserData?.userId}
                  />
                </TableCell>
                <TableCell>{relativeTime(createdAt)}</TableCell>
                <TableCell>
                  <OrgMemberAction data={item} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {!data.length && (
        <div className="my-4 text-muted-foreground flex justify-center">
          No results.
        </div>
      )}
    </>
  );
};
