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
import { User } from "@clerk/nextjs/server";
import { useFormatter, useTranslations } from "next-intl";
import { SearchBar } from "@/components/search-bar";
import { NavPagination } from "@/components/nav-pagination";
import { useRouter } from "@/navigation";
import { StaffMetadataRole } from "../../../_components/staff-metadata-role";
import { StaffsTableAction } from "./staffs-table-action";
import { getEmailAddress } from "@/lib/utils";
import { StaffsTableSortBy } from "./staffs-table-sort-by";

interface StaffsTableProps {
  data: User[];
  totalPage: number;
}
export const StaffsTable = ({ data, totalPage }: StaffsTableProps) => {
  const t = useTranslations("staffs");
  const { relativeTime } = useFormatter();
  const router = useRouter();
  const handleClick = (id: string) => {
    router.push(`/admin/staffs/detail/${id}`);
  };
  return (
    <>
      <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center">
        <SearchBar placeholder={t("search.placeholder")} isPagination />
        <StaffsTableSortBy />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{t("table.thead.name")}</TableHead>
            <TableHead>{t("table.thead.role")}</TableHead>
            <TableHead>{t("table.thead.lastActiveAt")}</TableHead>
            <TableHead>{t("table.thead.lastSignedInAt")}</TableHead>
            <TableHead>{t("table.thead.joinedAt")} </TableHead>
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
                <TableCell>{getEmailAddress(staff)}</TableCell>
                <TableCell>
                  <StaffMetadataRole metadata={staff.publicMetadata} />
                </TableCell>
                <TableCell>
                  {staff.lastActiveAt
                    ? relativeTime(staff.lastActiveAt)
                    : t("table.trow.lastActiveAt")}
                </TableCell>
                <TableCell>
                  {staff.lastSignInAt
                    ? relativeTime(staff.lastSignInAt)
                    : t("table.trow.lastSignedInAt")}
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
    </>
  );
};
