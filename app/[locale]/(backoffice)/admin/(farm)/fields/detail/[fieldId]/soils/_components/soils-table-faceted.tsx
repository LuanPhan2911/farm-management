"use client";

import { SoilsFacetedNutrientNitrogen } from "./soils-faceted-nutrient-nitrogen";
import { SoilsFacetedNutrientPhosphorus } from "./soils-faceted-nutrient-phosphorus";
import { SoilsFacetedNutrientPotassium } from "./soils-facted-nutrient-potassium";

export const SoilsTableFaceted = () => {
  return (
    <div className="flex gap-2 my-2 lg:flex-row flex-col">
      <SoilsFacetedNutrientNitrogen />
      <SoilsFacetedNutrientPhosphorus />
      <SoilsFacetedNutrientPotassium />
    </div>
  );
};
