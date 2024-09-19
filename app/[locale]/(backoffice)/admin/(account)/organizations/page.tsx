import { getOrganizations, OrganizationSortBy } from "@/services/organizations";
import { OrgsTable } from "./_components/orgs-table";
import { parseToNumber } from "@/lib/utils";

interface OrganizationPageProps {
  searchParams: {
    page?: string;
    query?: string;
    orderBy?: OrganizationSortBy;
  };
}
const OrganizationsPage = async ({ searchParams }: OrganizationPageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const { orderBy, query } = searchParams;
  const { data: organizations, totalPage } = await getOrganizations({
    currentPage: page,
    orderBy,
    query,
  });

  return (
    <div className="flex flex-col gap-y-4 h-full py-4 ">
      <OrgsTable orgs={structuredClone(organizations)} totalPage={totalPage} />
    </div>
  );
};

export default OrganizationsPage;
