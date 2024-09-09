import { getSoilsOnField } from "@/services/soils";
import { SoilsTable } from "./_components/soils-table";
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
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const orderBy = searchParams.orderBy;
  const filterString = searchParams.filterString || "";
  const filterNumber = searchParams.filterNumber || "";
  const begin = searchParams.begin ? new Date(searchParams.begin) : undefined;
  const end = searchParams.end ? new Date(searchParams.end) : undefined;

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
