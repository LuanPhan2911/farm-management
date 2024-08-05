import { BestSaleProductChart } from "./best-sale-product-chart";
import { WeeklySaleChart } from "./weekly-sale-chart";

export const Charts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <WeeklySaleChart />
      <BestSaleProductChart />
    </div>
  );
};
