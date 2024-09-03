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

import { Organization } from "@clerk/nextjs/server";
import { useFormatter, useTranslations } from "next-intl";
import { SearchBar } from "@/components/search-bar";
import { NavPagination } from "@/components/nav-pagination";
import { UserAvatar } from "@/components/user-avatar";

import { useRouter } from "@/navigation";
import { OrgCreateButton } from "./org-create-button";
import {
  SortByDropdown,
  SortByOption,
} from "@/components/form/sort-by-dropdown";
import { useSearchParams } from "next/navigation";

interface OrgsTableProps {
  orgs: Organization[];
  totalPage: number;
}
export const OrgsTable = ({ orgs, totalPage }: OrgsTableProps) => {
  const t = useTranslations("organizations");
  const searchParams = useSearchParams();
  const { relativeTime } = useFormatter();
  const router = useRouter();
  const handleClick = (org: Organization) => {
    router.push(`/admin/organizations/detail/${org.id}`);
  };
  const sortByOptions: SortByOption[] = [
    {
      label: "Created At",
      value: "created_at",
    },
    {
      label: "Name",
      value: "name",
    },
    {
      label: "Members count",
      value: "members_count",
    },
  ];
  const defaultSortBy = searchParams.get("orderBy") || "created_at";
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("page.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between md:items-center py-4 md:flex-row flex-col gap-2 items-end">
          <div className="flex gap-x-2">
            <SearchBar placeholder={t("search.placeholder")} isPagination />
            <SortByDropdown
              options={sortByOptions}
              defaultValue={defaultSortBy}
            />
          </div>
          <OrgCreateButton />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>{t("table.thead.name")}</TableHead>
              <TableHead>{t("table.thead.slug")}</TableHead>
              <TableHead>{t("table.thead.memberCount")}</TableHead>
              <TableHead>{t("table.thead.createdAt")} </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orgs.map((organization) => {
              return (
                <TableRow
                  key={organization.id}
                  className="cursor-pointer"
                  onClick={() => handleClick(organization)}
                >
                  <TableCell>
                    <UserAvatar src={organization.imageUrl} />
                  </TableCell>
                  <TableCell>{organization.name}</TableCell>
                  <TableCell>{organization.slug}</TableCell>
                  <TableCell>{organization.membersCount}</TableCell>
                  <TableCell>{relativeTime(organization.createdAt)}</TableCell>
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
