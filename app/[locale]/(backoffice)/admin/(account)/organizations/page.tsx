import { getOrganizations, OrganizationSortBy } from "@/services/organizations";
import { OrgsTable } from "./_components/orgs-table";
import { parseToNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { OrgCreateButton } from "./_components/org-create-button";

interface OrganizationPageProps {
  searchParams: {
    page?: string;
    query?: string;
    orderBy?: OrganizationSortBy;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("organizations.page");
  return {
    title: t("title"),
  };
}
const OrganizationsPage = async ({ searchParams }: OrganizationPageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const t = await getTranslations("organizations.page");
  const { orderBy, query } = searchParams;
  const { data: organizations, totalPage } = await getOrganizations({
    currentPage: page,
    orderBy,
    query,
  });

  return (
    <div className="flex flex-col gap-y-4 h-full py-4 ">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end">
            <OrgCreateButton />
          </div>
          <OrgsTable
            orgs={structuredClone(organizations)}
            totalPage={totalPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationsPage;
