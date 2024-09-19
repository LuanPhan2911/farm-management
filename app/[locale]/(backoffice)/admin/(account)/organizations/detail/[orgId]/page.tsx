import {
  getOrganizationById,
  getOrganizationMembership,
  OrganizationMemberShipSortBy,
} from "@/services/organizations";
import { notFound } from "next/navigation";

import { OrgTabs } from "../../_components/org-tabs";
import { parseToNumber } from "@/lib/utils";

interface OrganizationDetailPageProps {
  params: {
    orgId: string;
  };
  searchParams: {
    page?: string;
    orderBy?: OrganizationMemberShipSortBy;
  };
}

const OrganizationDetailPage = async ({
  params,
  searchParams,
}: OrganizationDetailPageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const { orderBy } = searchParams;
  const org = await getOrganizationById(params.orgId);
  const { data: orgMember, totalPage } = await getOrganizationMembership({
    currentPage: page,
    orgId: params.orgId,
    orderBy,
  });
  if (!org || !orgMember.length) {
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
