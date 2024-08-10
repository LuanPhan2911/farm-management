import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { columns, Payment } from "./columns";
import { DataTable } from "@/components/datatable";
interface RecentOrdersProps {
  data: Payment[];
}
export const RecentOrders = async ({ data }: RecentOrdersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={data}
          filterColumn={{
            isShown: true,
            placeholder: "Filter email...",
            value: "email",
          }}
        />
      </CardContent>
    </Card>
  );
};
