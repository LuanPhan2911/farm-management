import { getUsersTable, LIMIT } from "@/services/users";
import { UsersTable } from "./_components/users-table";

interface UsersPageProps {
  searchParams: {
    query?: string;
    page?: string;
  };
}
const UsersPage = async ({ searchParams }: UsersPageProps) => {
  const query = searchParams?.query || "";
  const page = searchParams?.page ? Number(searchParams?.page) : 1;

  const { data: users, totalCount } = await getUsersTable(query, page);
  const totalPage = Math.ceil(totalCount / LIMIT);

  return (
    <div className="flex flex-col gap-y-4 h-full py-4">
      <UsersTable data={structuredClone(users)} totalPage={totalPage} />
    </div>
  );
};

export default UsersPage;
