import { getStaffsTable } from "@/services/staffs";
import { StaffsTable } from "./_components/staffs-table";

interface StaffsPageProps {
  searchParams: {
    query?: string;
    page?: string;
  };
}
const StaffsPage = async ({ searchParams }: StaffsPageProps) => {
  const query = searchParams?.query || "";
  const page = searchParams?.page ? Number(searchParams?.page) : 1;
  const { data: staffs, totalPage } = await getStaffsTable(query, page);

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <StaffsTable data={structuredClone(staffs)} totalPage={totalPage} />
    </div>
  );
};

export default StaffsPage;
