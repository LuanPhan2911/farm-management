import { getStaffsTable } from "@/services/staffs";
import { StaffsTable } from "./_components/staffs-table";
import { UserOrderBy } from "@/services/users";
import { parseToNumber } from "@/lib/utils";

interface StaffsPageProps {
  searchParams: {
    query?: string;
    page?: string;
    orderBy?: UserOrderBy;
  };
}
const StaffsPage = async ({ searchParams }: StaffsPageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const { orderBy, query } = searchParams;
  const { data: staffs, totalPage } = await getStaffsTable({
    query,
    currentPage: page,
    orderBy,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <StaffsTable data={structuredClone(staffs)} totalPage={totalPage} />
    </div>
  );
};

export default StaffsPage;
