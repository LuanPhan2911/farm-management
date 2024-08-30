"use client";
import { NavPagination } from "@/components/nav-pagination";
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
import { OrgMemberAdd } from "./org-member-add";
import { OrgMemberAction } from "./org-member-action";
import { OrgMemberRoleEditButton } from "./org-member-role-edit-button";
import { OrgRole } from "@/types";
import { useFormatter, useTranslations } from "next-intl";
import { OrganizationMembership } from "@clerk/nextjs/server";
interface OrgMemberTableProps {
  data: OrganizationMembership[];
  totalPage: number;
}
export const OrgMemberTable = ({ data, totalPage }: OrgMemberTableProps) => {
  const t = useTranslations("organizations");
  const { relativeTime } = useFormatter();
  return (
    <>
      <div className="flex justify-between md:items-center py-4 md:flex-row flex-col gap-2 items-end">
        <div className="w-[300px]">
          <SearchBar
            placeholder={t("search.member.placeholder")}
            isPagination
          />
        </div>
        <OrgMemberAdd />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{t("table.thead.name")}</TableHead>
            <TableHead>{t("table.thead.role")}</TableHead>
            <TableHead>{t("table.thead.createdAt")}</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map(({ publicUserData, role, createdAt, id }) => {
            return (
              <TableRow key={publicUserData?.userId} className="cursor-pointer">
                <TableCell>
                  <UserAvatar
                    src={publicUserData?.imageUrl}
                    size={"default"}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>
                  <div>{publicUserData?.firstName}</div>
                  <div>{publicUserData?.identifier}</div>
                </TableCell>
                <TableCell>
                  <OrgMemberRoleEditButton
                    defaultRole={role as OrgRole}
                    userId={publicUserData?.userId}
                  />
                </TableCell>
                <TableCell>{relativeTime(createdAt)}</TableCell>
                <TableCell>
                  <OrgMemberAction data={publicUserData} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="py-4">
        <NavPagination totalPage={totalPage} />
      </div>
    </>
  );
};
