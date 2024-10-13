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
import { useRouter } from "@/navigation";

interface OrgMemberTableProps {
  data: OrganizationMembership[];
  totalPage: number;
}
export const OrgMemberTable = ({ data, totalPage }: OrgMemberTableProps) => {
  const t = useTranslations("organizations");
  const { relativeTime } = useFormatter();
  const router = useRouter();
  const handleEdit = (row: OrganizationMembership) => {
    router.push(`/admin/staffs/detail/${row.publicUserData?.userId}`);
  };
  return (
    <>
      <div className="flex justify-end">
        <OrgMemberAdd />
      </div>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center">
        <SearchBar placeholder={t("search.placeholder")} isPagination />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{t("table.member.thead.firstName")}</TableHead>
            <TableHead>{t("table.member.thead.lastName")}</TableHead>
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
              <TableRow
                key={publicUserData?.userId}
                className="cursor-pointer"
                onClick={() => handleEdit(item)}
              >
                <TableCell>
                  <UserAvatar
                    src={publicUserData?.imageUrl || undefined}
                    size={"default"}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>{publicUserData?.firstName}</TableCell>
                <TableCell>{publicUserData?.lastName}</TableCell>
                <TableCell>{publicUserData?.identifier}</TableCell>
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
      {!data.length && (
        <div className="my-4 text-muted-foreground flex justify-center">
          No results.
        </div>
      )}
      <div className="py-4">
        <NavPagination totalPage={totalPage} />
      </div>
    </>
  );
};
