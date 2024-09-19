import { getPesticides } from "@/services/pesticides";
import { PesticidesTable } from "./_components/pesticides-table";
import { parseToNumber } from "@/lib/utils";

interface PesticidePageProps {
  params: {};
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
  };
}
const PesticidesPage = async ({ searchParams }: PesticidePageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
  const { data, totalPage } = await getPesticides({
    filterNumber,
    filterString,
    orderBy,
    page,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <PesticidesTable data={data} totalPage={totalPage} />
    </div>
  );
};

export default PesticidesPage;
