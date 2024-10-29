import {
  getOrganizationById,
  getOrganizationMembership,
} from "@/services/organizations";
import { notFound } from "next/navigation";

import { OrgTabs } from "../../../_components/org-tabs";
import { getTranslations } from "next-intl/server";
import { getCurrentStaff } from "@/services/staffs";

interface OrganizationDetailPageProps {
  params: {
    orgId: string;
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
}: OrganizationDetailPageProps) => {
  const org = await getOrganizationById(params.orgId);
  const currentStaff = await getCurrentStaff();
  const orgMember = await getOrganizationMembership({
    orgId: params.orgId,
  });
  if (!org || !currentStaff || !orgMember.length) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <OrgTabs
        org={structuredClone(org)}
        orgMember={structuredClone(orgMember)}
        currentStaff={currentStaff}
      />
    </div>
  );
};

export default OrganizationDetailPage;
