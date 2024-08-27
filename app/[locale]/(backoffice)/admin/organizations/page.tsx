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
    order_by?: "created_at" | "name" | "members_count";
  };
}
const OrganizationsPage = async ({ searchParams }: OrganizationPageProps) => {
  const query = searchParams.query || "";
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const orderBy = searchParams.order_by || "created_at";
  const { data: organizations, totalPage } = await getOrganizations(
    query,
    page,
    orderBy
  );

  return (
    <div className="flex flex-col gap-y-4 h-full py-4 ">
      <OrgsTable orgs={structuredClone(organizations)} totalPage={totalPage} />
    </div>
  );
};

export default OrganizationsPage;
