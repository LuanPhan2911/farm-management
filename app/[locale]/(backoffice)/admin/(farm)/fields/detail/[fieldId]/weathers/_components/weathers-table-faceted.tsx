"use client";
import { WeathersFacetedStatusWithQueryClient } from "./weathers-faceted-status";
import { WeathersFacetedTemperature } from "./weathers-faceted-temperature";
import { WeathersFacetedHumidity } from "./weathers-faceted-humidity";
import { WeathersFacetedRainfall } from "./weathers-faceted-rainfall";

export const WeatherTableFaceted = () => {
  return (
    <div className="flex gap-2 my-2 lg:flex-row flex-col">
      <WeathersFacetedStatusWithQueryClient />
      <WeathersFacetedTemperature />
      <WeathersFacetedHumidity />
      <WeathersFacetedRainfall />
    </div>
  );
};
