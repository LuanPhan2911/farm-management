import { getWeathersOnField } from "@/services/weathers";
import { WeathersTable } from "./_components/weathers-table";
import { parseToDate, parseToNumber } from "@/lib/utils";
interface WeathersPageProps {
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
const WeathersPage = async ({ params, searchParams }: WeathersPageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
  const begin = parseToDate(searchParams.begin);
  const end = parseToDate(searchParams.end);

  const { data, totalPage } = await getWeathersOnField({
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
      <WeathersTable data={data} totalPage={totalPage} />
    </div>
  );
};

export default WeathersPage;
