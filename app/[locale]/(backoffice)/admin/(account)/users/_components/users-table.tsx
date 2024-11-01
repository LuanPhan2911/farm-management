"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/user-avatar";
import { UsersTableAction } from "./users-table-action";
import { User } from "@clerk/nextjs/server";
import { useFormatter, useTranslations } from "next-intl";
import { SearchBar } from "@/components/search-bar";
import { NavPagination } from "@/components/nav-pagination";

import { getEmailAddress, getFullName } from "@/lib/utils";
import { UsersTableSortBy } from "./users-table-sort-by";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

interface UsersTableProps {
  data: User[];
  totalPage: number;
}
export const UsersTable = ({ data, totalPage }: UsersTableProps) => {
  const t = useTranslations("users");
  const { relativeTime } = useFormatter();
  const router = useRouterWithRole();
  const handleClick = (id: string) => {
    router.push(`users/detail/${id}`);
  };
  return (
    <>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center">
        <SearchBar placeholder={t("search.placeholder")} isPagination />
        <UsersTableSortBy />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{t("table.thead.name")}</TableHead>
            <TableHead>{t("table.thead.lastSignedInAt")}</TableHead>
            <TableHead>{t("table.thead.lastActiveAt")}</TableHead>
            <TableHead>{t("table.thead.joinedAt")} </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => {
            return (
              <TableRow
                key={user.id}
                className="cursor-pointer"
                onClick={() => handleClick(user.id)}
              >
                <TableCell>
                  <UserAvatar
                    src={user.imageUrl}
                    size={"default"}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {getFullName(user) || t("table.trow.name")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getEmailAddress(user)}
                    </p>
                  </div>
                </TableCell>

                <TableCell>
                  {user.lastSignInAt
                    ? relativeTime(user.lastSignInAt)
                    : t("table.trow.lastSignedInAt")}
                </TableCell>
                <TableCell>
                  {user.lastActiveAt
                    ? relativeTime(user.lastActiveAt)
                    : t("table.trow.lastActiveAt")}
                </TableCell>
                <TableCell>{relativeTime(user.createdAt)}</TableCell>

                <TableCell>
                  <UsersTableAction data={user} />
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
