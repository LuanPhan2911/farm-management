"use client";

import { WeatherStatus } from "@prisma/client";
import {
  CloudFog,
  CloudRain,
  CloudSnow,
  Cloudy,
  SunDim,
  Tornado,
  Wind,
} from "lucide-react";

interface WeatherStatusValueProps {
  status: WeatherStatus;
}
export const WeatherStatusValue = ({ status }: WeatherStatusValueProps) => {
  const options = {
    [WeatherStatus.SUNNY]: {
      icon: <SunDim className="h-6 w-6 text-yellow-300" />,
      value: WeatherStatus.SUNNY,
    },
    [WeatherStatus.CLOUDY]: {
      icon: <Cloudy className="h-6 w-6 text-sky-400" />,
      value: WeatherStatus.CLOUDY,
    },
    [WeatherStatus.RAINY]: {
      icon: <CloudRain className="h-6 w-6 text-slate-500" />,
      value: WeatherStatus.RAINY,
    },
    [WeatherStatus.WINDY]: {
      icon: <Wind className="h-6 w-6 text-green-400" />,
      value: WeatherStatus.WINDY,
    },
    [WeatherStatus.FOGGY]: {
      icon: <CloudFog className="h-6 w-6 text-blue-600" />,
      value: WeatherStatus.FOGGY,
    },
    [WeatherStatus.SNOWY]: {
      icon: <CloudSnow className="h-6 w-6 text-slate-300" />,
      value: WeatherStatus.SNOWY,
    },
    [WeatherStatus.STORMY]: {
      icon: <Tornado className="h-6 w-6 text-rose-500" />,
      value: WeatherStatus.STORMY,
    },
  };
  const { icon, value } = options[status];
  return (
    <div className="flex items-center">
      {icon}
      <span className="ml-2"> {value}</span>
    </div>
  );
};
