"use client";

import { OrganizationSwitcher, useAuth } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { useUpdateSearchParam } from "@/hooks/use-update-search-param";
import { useEffect } from "react";

interface OrgSwitcherButtonProps {}
export const OrgSwitcherButton = () => {
  const { orgId } = useAuth();
  const { updateSearchParam } = useUpdateSearchParam(
    "orgId",
    orgId || undefined
  );

  useEffect(() => {
    updateSearchParam(orgId || undefined);
  }, [orgId, updateSearchParam]);
  return (
    <Button className="bg-slate-300">
      <OrganizationSwitcher
        afterCreateOrganizationUrl={(org) =>
          `/admin/organizations/detail/${org.id}`
        }
        afterLeaveOrganizationUrl={`/admin/organizations`}
        skipInvitationScreen
      />
    </Button>
  );
};
