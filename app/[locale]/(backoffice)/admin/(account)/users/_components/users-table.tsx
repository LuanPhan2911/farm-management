"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserAvatar } from "@/components/user-avatar";
import { UsersTableAction } from "./users-table-action";
import { User } from "@clerk/nextjs/server";
import { useFormatter, useTranslations } from "next-intl";
import { UserMetadataRole } from "./user-metadata-role";
import { SearchBar } from "@/components/search-bar";
import { NavPagination } from "@/components/nav-pagination";
import { useRouter } from "@/navigation";

interface UsersTableProps {
  data: User[];
  totalPage: number;
}
export const UsersTable = ({ data, totalPage }: UsersTableProps) => {
  const tTable = useTranslations("users.table");
  const { relativeTime } = useFormatter();
  const router = useRouter();
  const handleClick = (userId: string) => {
    router.push(`/admin/users/detail/${userId}`);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tTable("heading")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-[400px] py-4">
          <SearchBar placeholder="Search..." isPagination />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{tTable("thead.name")}</TableHead>
              <TableHead></TableHead>
              <TableHead>{tTable("thead.role")}</TableHead>
              <TableHead>{tTable("thead.lastSignedIn")}</TableHead>
              <TableHead>{tTable("thead.joined")} </TableHead>
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
                  <TableCell>{user.emailAddresses[0].emailAddress}</TableCell>
                  <TableCell>
                    <UserMetadataRole metadata={user.publicMetadata} />
                  </TableCell>
                  <TableCell>
                    {user.lastSignInAt
                      ? relativeTime(user.lastSignInAt)
                      : "Never signed"}
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
