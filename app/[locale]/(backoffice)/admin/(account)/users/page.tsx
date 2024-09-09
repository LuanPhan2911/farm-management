import { getUsersTable, UserOrderBy } from "@/services/users";
import { UsersTable } from "./_components/users-table";

interface UsersPageProps {
  searchParams: {
    query?: string;
    page?: string;
    orderBy?: UserOrderBy;
  };
}
const UsersPage = async ({ searchParams }: UsersPageProps) => {
  const query = searchParams?.query || "";
  const page = searchParams?.page ? Number(searchParams?.page) : 1;
  const orderBy = searchParams?.orderBy;

  const { data: users, totalPage } = await getUsersTable({
    currentPage: page,
    query,
    orderBy,
  });

  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <UsersTable data={structuredClone(users)} totalPage={totalPage} />
    </div>
  );
};

export default UsersPage;
