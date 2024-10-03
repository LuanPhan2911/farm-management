import {
  getOrganizationById,
  getOrganizationMembership,
  OrganizationMemberShipSortBy,
} from "@/services/organizations";
import { notFound } from "next/navigation";

import { OrgTabs } from "../../../_components/org-tabs";
import { parseToNumber } from "@/lib/utils";
import { getTranslations } from "next-intl/server";
import { currentStaff } from "@/services/staffs";

interface OrganizationDetailPageProps {
  params: {
    orgId: string;
  };
  searchParams: {
    page?: string;
    orderBy?: OrganizationMemberShipSortBy;
  };
}

export async function generateMetadata() {
  const t = await getTranslations("organizations.page.detail");
  return {
    title: t("title"),
  };
}
const OrganizationDetailPage = async ({
  params,
  searchParams,
}: OrganizationDetailPageProps) => {
  const page = parseToNumber(searchParams!.page, 1);
  const { orderBy } = searchParams;
  const org = await getOrganizationById(params!.orgId);
  const staff = await currentStaff();
  const { data: orgMember, totalPage } = await getOrganizationMembership({
    currentPage: page,
    orgId: params!.orgId,
    orderBy,
  });
  if (!org || !orgMember.length || !staff) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-y-4 min-h-full py-4">
      <OrgTabs
        org={structuredClone(org)}
        orgMember={structuredClone(orgMember)}
        totalPageOrgMember={totalPage}
        currentStaff={staff}
      />
    </div>
  );
};

export default OrganizationDetailPage;
