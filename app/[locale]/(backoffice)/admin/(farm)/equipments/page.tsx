import { getEquipments } from "@/services/equipments";
import { EquipmentsTable } from "./_components/equipments-table";
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
  const page = searchParams.page ? Number(searchParams.page) : 1;
  const orderBy = searchParams.orderBy;
  const filterString = searchParams.filterString || "";
  const filterNumber = searchParams.filterNumber || "";
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
