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
import { User } from "@clerk/nextjs/server";
import { useFormatter, useTranslations } from "next-intl";
import { SearchBar } from "@/components/search-bar";
import { NavPagination } from "@/components/nav-pagination";
import { useRouter } from "@/navigation";
import { StaffMetadataRole } from "../../../_components/staff-metadata-role";
import { StaffsTableAction } from "./staffs-table-action";
import { StaffCreateButton } from "./staff-create-button";

interface StaffsTableProps {
  data: User[];
  totalPage: number;
}
export const StaffsTable = ({ data, totalPage }: StaffsTableProps) => {
  const tTable = useTranslations("staffs.table");
  const { relativeTime } = useFormatter();
  const router = useRouter();
  const handleClick = (id: string) => {
    router.push(`/admin/staffs/detail/${id}`);
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{tTable("heading")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between md:items-center py-4 md:flex-row flex-col gap-2 items-end">
          <div className="w-[300px]">
            <SearchBar placeholder="Search..." isPagination />
          </div>
          <StaffCreateButton label="Create" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>{tTable("thead.name")}</TableHead>
              <TableHead>{tTable("thead.role")}</TableHead>
              <TableHead>{tTable("thead.lastSignedIn")}</TableHead>
              <TableHead>{tTable("thead.joined")} </TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((staff) => {
              return (
                <TableRow
                  key={staff.id}
                  className="cursor-pointer"
                  onClick={() => handleClick(staff.id)}
                >
                  <TableCell>
                    <UserAvatar
                      src={staff.imageUrl}
                      size={"default"}
                      className="rounded-full"
                    />
                  </TableCell>
                  <TableCell>{staff.emailAddresses[0].emailAddress}</TableCell>
                  <TableCell>
                    <StaffMetadataRole metadata={staff.publicMetadata} />
                  </TableCell>
                  <TableCell>
                    {staff.lastSignInAt
                      ? relativeTime(staff.lastSignInAt)
                      : "Never signed"}
                    {}
                  </TableCell>
                  <TableCell>{relativeTime(staff.createdAt)}</TableCell>
                  <TableCell>
                    <StaffsTableAction data={staff} />
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
