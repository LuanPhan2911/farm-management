import { getOrganizations, OrganizationSortBy } from "@/services/organizations";
import { parseToNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { OrgsTable } from "../../admin/(account)/organizations/_components/orgs-table";

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
  const page = parseToNumber(searchParams!.page, 1);
  const t = await getTranslations("organizations.page");
  const { orderBy, query } = searchParams;

  const { data, totalPage } = await getOrganizations({
    page: page,
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
          <OrgsTable orgs={structuredClone(data)} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizationsPage;
