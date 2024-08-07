import { useTranslations } from "next-intl";
import { Heading } from "../_components/heading";
import { Charts } from "./_components/charts";
import { LargeCards } from "./_components/large-cards";
import { SmallCards } from "./_components/small-cards";
import { RecentOrders } from "./_components/recent-orders";

const Dashboard = () => {
  const t = useTranslations("dashboard");
  return (
    <div className="flex flex-col gap-y-4 h-full">
      <Heading title={t("heading")} />
      {/* Large cards */}
      <LargeCards />
      {/* Small card */}
      <SmallCards />
      {/* Charts */}
      <Charts />
      {/* Recent orders */}
      <RecentOrders />
    </div>
  );
};

export default Dashboard;
