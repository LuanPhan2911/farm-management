"use client";

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
import { OrgsTableSortBy } from "./orgs-table-sort-by";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useOrganizationList } from "@clerk/nextjs";
import { toast } from "sonner";

interface OrgsTableProps {
  orgs: Organization[];
  totalPage: number;
}
export const OrgsTable = ({ orgs, totalPage }: OrgsTableProps) => {
  const t = useTranslations("organizations");
  const { relativeTime } = useFormatter();
  const router = useRouter();
  const { isSuperAdmin } = useCurrentStaffRole();
  const { setActive } = useOrganizationList();
  const handleClick = (org: Organization) => {
    setActive?.({ organization: org.id }).catch(() => {
      setActive?.({ organization: null });
      toast.warning(t("other.setActive"));
    });
    router.push(`/admin/organizations/detail/${org.id}`);
  };

  return (
    <>
      {isSuperAdmin && (
        <div className="py-4 flex gap-2 lg:flex-row flex-col items-start lg:items-center">
          <SearchBar placeholder={t("search.placeholder")} isPagination />
          <OrgsTableSortBy />
        </div>
      )}

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
      {!orgs.length && (
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
