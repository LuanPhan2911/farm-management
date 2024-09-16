import { getFertilizers } from "@/services/fertilizers";
import { FertilizersTable } from "./_components/fertilizers-table";

interface FertilizerPageProps {
  params: {};
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
  };
}
const FertilizersPage = async ({ searchParams }: FertilizerPageProps) => {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const orderBy = searchParams.orderBy;
  const filterString = searchParams.filterString || "";
  const filterNumber = searchParams.filterNumber || "";
  const { data, totalPage } = await getFertilizers({
    filterNumber,
    filterString,
    orderBy,
    page,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <FertilizersTable data={data} totalPage={totalPage} />
    </div>
  );
};

export default FertilizersPage;
