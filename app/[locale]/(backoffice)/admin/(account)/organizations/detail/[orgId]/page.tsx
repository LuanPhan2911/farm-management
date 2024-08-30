import {
  getOrganizationById,
  getOrganizationMembership,
} from "@/services/organizations";
import { notFound } from "next/navigation";

import { OrgTabs } from "../../_components/org-tabs";

interface OrganizationDetailPageProps {
  params: {
    orgId: string;
  };
}

const OrganizationDetailPage = async ({
  params,
}: OrganizationDetailPageProps) => {
  const org = await getOrganizationById(params.orgId);

  const { data: orgMember, totalPage } = await getOrganizationMembership(
    params.orgId,
    1
  );

  if (!org) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <OrgTabs
        org={structuredClone(org)}
        orgMember={structuredClone(orgMember)}
        totalPageOrgMember={totalPage}
      />
    </div>
  );
};

export default OrganizationDetailPage;
