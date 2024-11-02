import {
  getOrganizationById,
  getOrganizationMembership,
} from "@/services/organizations";
import { notFound } from "next/navigation";

import { getTranslations } from "next-intl/server";
import { OrgTabs } from "@/app/[locale]/(backoffice)/admin/(account)/organizations/_components/org-tabs";

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

  const orgMember = await getOrganizationMembership({
    orgId: params.orgId,
  });
  if (!org || !orgMember.length) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <OrgTabs
        org={structuredClone(org)}
        orgMember={structuredClone(orgMember)}
      />
    </div>
  );
};

export default OrganizationDetailPage;
