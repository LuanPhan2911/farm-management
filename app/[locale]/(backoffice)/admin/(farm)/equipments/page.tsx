import { getEquipments } from "@/services/equipments";
import { EquipmentsTable } from "./_components/equipments-table";
import { parseToNumber } from "@/lib/utils";
interface EquipmentsPageProps {
  params: {};
  searchParams: {
    page?: string;
    orderBy?: string;
    filterString?: string;
    filterNumber?: string;
  };
}
const EquipmentsPage = async ({
  params,
  searchParams,
}: EquipmentsPageProps) => {
  const page = parseToNumber(searchParams.page, 1);
  const { orderBy, filterNumber, filterString } = searchParams;
  const { data, totalPage } = await getEquipments({
    filterNumber,
    filterString,
    orderBy,
    page,
  });
  return (
    <div className="flex flex-col gap-4 py-4 h-full">
      <EquipmentsTable data={data} totalPage={totalPage} />
    </div>
  );
};

export default EquipmentsPage;
