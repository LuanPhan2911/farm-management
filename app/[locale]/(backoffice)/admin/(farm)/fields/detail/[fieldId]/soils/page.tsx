import { getSoilsOnField } from "@/services/soils";
import { SoilsTable } from "./_components/soils-table";
import { parseToDate, parseToNumber } from "@/lib/utils";
interface SoilsPageProps {
  params: {
    fieldId: string;
  };
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
    begin?: string;
    end?: string;
  };
}
const SoilsPage = async ({ params, searchParams }: SoilsPageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
  const begin = parseToDate(searchParams.begin);
  const end = parseToDate(searchParams.end);

  const { data, totalPage } = await getSoilsOnField({
    fieldId: params.fieldId,
    page,
    orderBy,
    filterString,
    filterNumber,
    begin,
    end,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <SoilsTable data={data} totalPage={totalPage} />
    </div>
  );
};

export default SoilsPage;
