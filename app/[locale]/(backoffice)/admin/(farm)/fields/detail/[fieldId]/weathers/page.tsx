import { getWeathersOnField } from "@/services/weathers";
import { WeathersTable } from "./_components/weathers-table";
interface WeathersPageProps {
  params: {
    fieldId: string;
  };
  searchParams: {
    page?: string;
    orderBy?: string;
  };
}
const WeathersPage = async ({ params, searchParams }: WeathersPageProps) => {
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const orderBy = searchParams.orderBy;
  const { data, totalPage } = await getWeathersOnField({
    fieldId: params.fieldId,
    page,
    orderBy,
  });

  return (
    <div className="flex flex-col gap-y-4 py-4 h-full">
      <WeathersTable data={data} totalPage={totalPage} />
    </div>
  );
};

export default WeathersPage;
