"use client";

import { PesticidesFacetedToxicityLevelWithQueryClient } from "./pesticides-faceted-toxicity-level";
import { PesticidesFacetedTypeWithQueryClient } from "./pesticides-faceted-type";

export const PesticidesTableFaceted = () => {
  return (
    <div className="flex gap-2 my-2 lg:flex-row flex-col">
      <PesticidesFacetedTypeWithQueryClient />
      <PesticidesFacetedToxicityLevelWithQueryClient />
    </div>
  );
};
