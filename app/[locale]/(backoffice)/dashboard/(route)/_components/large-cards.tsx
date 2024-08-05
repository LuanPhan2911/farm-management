import { Layers } from "lucide-react";
import { LargeCard } from "../../_components/large-card";

export const LargeCards = () => {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      <LargeCard icon={Layers} description="Today orders">
        <h2 className="text-2xl">$20</h2>
      </LargeCard>
      <LargeCard icon={Layers} description="Today orders">
        <h2 className="text-2xl">$20</h2>
      </LargeCard>
      <LargeCard icon={Layers} description="Today orders">
        <h2>$20</h2>
      </LargeCard>
      <LargeCard icon={Layers} description="Today orders">
        <h2>$20</h2>
      </LargeCard>
    </ul>
  );
};
