import { getUsersTable, UserOrderBy } from "@/services/users";
import { UsersTable } from "./_components/users-table";
import { parseToNumber } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

interface UsersPageProps {
  searchParams: {
    query?: string;
    page?: string;
    orderBy?: UserOrderBy;
  };
}
export async function generateMetadata() {
  const t = await getTranslations("users.page");
  return {
    title: t("title"),
  };
}

const UsersPage = async ({ searchParams }: UsersPageProps) => {
  const page = parseToNumber(searchParams!.page, 1);
  const { orderBy, query } = searchParams;
  const t = await getTranslations("users.page");

  const { data: users, totalPage } = await getUsersTable({
    currentPage: page,
    query,
    orderBy,
  });

  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable data={structuredClone(users)} totalPage={totalPage} />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
