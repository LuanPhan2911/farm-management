import {
  getOrganizationById,
  getOrganizationMembership,
  OrganizationMemberShipSortBy,
} from "@/services/organizations";
import { notFound } from "next/navigation";

import { OrgTabs } from "../../_components/org-tabs";

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
  const org = await getOrganizationById(params.orgId);
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const orderBy = searchParams.orderBy;

  if (!org) {
    notFound();
  }
  const { data: orgMember, totalPage } = await getOrganizationMembership({
    currentPage: page,
    orgId: org?.id,
    orderBy,
  });

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
