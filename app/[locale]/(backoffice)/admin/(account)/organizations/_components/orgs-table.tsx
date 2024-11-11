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

import { OrgsTableSortBy } from "./orgs-table-sort-by";
import { useCurrentStaffRole } from "@/hooks/use-current-staff-role";
import { useAuth, useOrganizationList } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouterWithRole } from "@/hooks/use-router-with-role";

interface OrgsTableProps {
  orgs: Organization[];
  totalPage: number;
}
export const OrgsTable = ({ orgs, totalPage }: OrgsTableProps) => {
  const t = useTranslations("organizations");
  const { relativeTime } = useFormatter();
  const { push } = useRouterWithRole();
  const { isSuperAdmin } = useCurrentStaffRole();
  const { setActive } = useOrganizationList();
  const { orgId } = useAuth();
  const handleClick = (org: Organization) => {
    if (orgId === org.id) {
      push(`organizations/detail/${org.id}`);
      return;
    }
    if (isSuperAdmin) {
      setActive?.({ organization: org.id })
        .then(() => {
          push(`organizations/detail/${org.id}`);
        })
        .catch(() => {
          setActive?.({ organization: null }).then(() => {
            push(`organizations/detail/${org.id}`);
            toast.warning(t("other.setActive"));
          });
        });
      return;
    }
    setActive?.({ organization: org.id }).then(() => {
      push(`organizations/detail/${org.id}`);
    });
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
            <TableHead>{t("table.thead.createdAt")} </TableHead>
            <TableHead className="text-right">
              {t("table.thead.maxMember")}
            </TableHead>
            <TableHead className="text-right">
              {t("table.thead.memberCount")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orgs.map((organization) => {
            const {
              name,
              slug,
              createdAt,
              imageUrl,
              maxAllowedMemberships,
              membersCount,
            } = organization;
            return (
              <TableRow
                key={organization.id}
                className="cursor-pointer"
                onClick={() => handleClick(organization)}
              >
                <TableCell>
                  <UserAvatar src={imageUrl} />
                </TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{slug}</TableCell>
                <TableCell>{relativeTime(createdAt)}</TableCell>
                <TableCell className="text-right">
                  {t("table.memberUnit", { value: maxAllowedMemberships })}
                </TableCell>
                <TableCell className="text-right">
                  {membersCount
                    ? t("table.memberUnit", { value: membersCount })
                    : t("table.trow.memberCount")}
                </TableCell>
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
