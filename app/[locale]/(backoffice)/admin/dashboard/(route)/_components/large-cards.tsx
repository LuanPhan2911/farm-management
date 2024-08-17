import { Layers } from "lucide-react";
import { LargeCard } from "../../_components/large-card";

export const LargeCards = () => {
  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      <LargeCard icon={Layers} description="Today orders">
        <h2 className="text-2xl">$20</h2>
      </LargeCard>
      <LargeCard icon={Layers} description="Yesterday orders">
        <h2 className="text-2xl">$20</h2>
      </LargeCard>
      <LargeCard icon={Layers} description="Last month orders">
        <h2>$20</h2>
      </LargeCard>
      <LargeCard icon={Layers} description="This month others">
        <h2>$20</h2>
      </LargeCard>
      <LargeCard icon={Layers} description="All time sales">
        <h2>$20</h2>
      </LargeCard>
    </ul>
  );
};
