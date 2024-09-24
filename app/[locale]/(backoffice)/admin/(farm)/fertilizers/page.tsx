import { getFertilizers } from "@/services/fertilizers";
import { FertilizersTable } from "./_components/fertilizers-table";
import { parseToNumber } from "@/lib/utils";

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
  const page = parseToNumber(searchParams.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
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
