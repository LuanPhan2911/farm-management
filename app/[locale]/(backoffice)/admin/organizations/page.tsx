import { getOrganizations } from "@/services/organizations";
import { OrgCreateButton } from "./_components/org-create-button";
import { OrgsTable } from "./_components/orgs-table";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "@/navigation";
import { getStaffsForCreatedByOrganization } from "@/services/staffs";

interface OrganizationPageProps {
  searchParams: {
    page?: string;
    query?: string;
  };
}
const OrganizationsPage = async ({ searchParams }: OrganizationPageProps) => {
  const query = searchParams.query || "";
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const { data: organizations, totalPage } = await getOrganizations(
    query,
    page
  );
  const orgCreatedBy = await getStaffsForCreatedByOrganization();

  return (
    <div className="flex flex-col gap-y-4 h-full py-4 ">
      <OrgsTable
        orgs={structuredClone(organizations)}
        totalPage={totalPage}
        orgCreatedBy={orgCreatedBy}
      />
    </div>
  );
};

export default OrganizationsPage;
