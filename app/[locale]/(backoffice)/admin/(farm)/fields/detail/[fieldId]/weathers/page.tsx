import { getWeathersOnField } from "@/services/weathers";
import { WeathersTable } from "./_components/weathers-table";
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
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const orderBy = searchParams.orderBy;
  const filterString = searchParams.filterString || "";
  const filterNumber = searchParams.filterNumber || "";
  const begin = searchParams.begin ? new Date(searchParams.begin) : undefined;
  const end = searchParams.end ? new Date(searchParams.end) : undefined;

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
