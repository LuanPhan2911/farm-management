import { getCropsOnField } from "@/services/crops";
import { CropsTable } from "./_components/crops-table";
import { parseToDate, parseToNumber } from "@/lib/utils";
interface CropsPageProps {
  params: {
    fieldId: string;
  };
  searchParams: {
    plantId?: string;
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
    begin?: string;
    end?: string;
    query?: string;
  };
}
const CropsPage = async ({ params, searchParams }: CropsPageProps) => {
  const { query: name, orderBy, plantId, filterNumber } = searchParams;
  const startDate = parseToDate(searchParams.begin);
  const endDate = parseToDate(searchParams.end);
  const page = parseToNumber(searchParams.page, 1);

  const { data, totalPage } = await getCropsOnField({
    fieldId: params.fieldId,
    page,
    orderBy,
    filterNumber,
    startDate,
    endDate,
    name,
    plantId,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <CropsTable data={data} totalPage={totalPage} />
    </div>
  );
};

export default CropsPage;
