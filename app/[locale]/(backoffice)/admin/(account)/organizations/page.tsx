import { getOrganizations, OrganizationSortBy } from "@/services/organizations";
import { OrgsTable } from "./_components/orgs-table";

interface OrganizationPageProps {
  searchParams: {
    page?: string;
    query?: string;
    orderBy?: OrganizationSortBy;
  };
}
const OrganizationsPage = async ({ searchParams }: OrganizationPageProps) => {
  const query = searchParams.query || "";
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const orderBy = searchParams.orderBy;
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
