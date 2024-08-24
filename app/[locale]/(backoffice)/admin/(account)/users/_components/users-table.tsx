"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useRouter } from "@/navigation";
import { getEmailAddress, getFullName } from "@/lib/utils";

interface UsersTableProps {
  data: User[];
  totalPage: number;
}
export const UsersTable = ({ data, totalPage }: UsersTableProps) => {
  const t = useTranslations("users");
  const { relativeTime } = useFormatter();
  const router = useRouter();
  const handleClick = (id: string) => {
    router.push(`/admin/users/detail/${id}`);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("page.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-[400px] py-4">
          <SearchBar placeholder={t("search.placeholder")} isPagination />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>{t("table.thead.name")}</TableHead>
              <TableHead>{t("table.thead.lastSignedIn")}</TableHead>
              <TableHead>{t("table.thead.joined")} </TableHead>
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
                      : t("table.trow.lastSignedIn")}
                    {}
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
        <div className="py-4">
          <NavPagination totalPage={totalPage} />
        </div>
      </CardContent>
    </Card>
  );
};
