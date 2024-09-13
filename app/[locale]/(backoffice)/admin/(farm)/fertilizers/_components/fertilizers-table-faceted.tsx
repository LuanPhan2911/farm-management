"use client";

import { FertilizersFacetedFrequencyWithQueryClient } from "./fertilizers-faceted-frequency";
import { FertilizersFacetedTypeWithQueryClient } from "./fertilizers-faceted-type";

export const FertilizersTableFaceted = () => {
  return (
    <div className="flex gap-2 my-2 lg:flex-row flex-col">
      <FertilizersFacetedTypeWithQueryClient />
      <FertilizersFacetedFrequencyWithQueryClient />
    </div>
  );
};
