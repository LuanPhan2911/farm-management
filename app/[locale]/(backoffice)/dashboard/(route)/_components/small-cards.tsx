import { Car, CheckCheck, RefreshCcw, ShoppingCart } from "lucide-react";
import { SmallCard } from "../../_components/small-card";

export const SmallCards = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      <SmallCard icon={ShoppingCart} title="Total orders" value="552" />
      <SmallCard icon={RefreshCcw} title="Order Pending" value="552" />
      <SmallCard icon={Car} title="Order Processing" value="552" />
      <SmallCard icon={CheckCheck} title="Order Delivered" value="552" />
    </div>
  );
};
