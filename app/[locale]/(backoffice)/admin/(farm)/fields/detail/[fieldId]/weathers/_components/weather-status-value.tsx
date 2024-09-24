"use client";

import { WeatherStatus } from "@prisma/client";
import {
  CircleHelp,
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
      icon: <SunDim className="h-4 w-4 text-yellow-300" />,
      value: WeatherStatus.SUNNY,
    },
    [WeatherStatus.CLOUDY]: {
      icon: <Cloudy className="h-4 w-4 text-sky-400" />,
      value: WeatherStatus.CLOUDY,
    },
    [WeatherStatus.RAINY]: {
      icon: <CloudRain className="h-4 w-4 text-slate-500" />,
      value: WeatherStatus.RAINY,
    },
    [WeatherStatus.WINDY]: {
      icon: <Wind className="h-4 w-4 text-green-400" />,
      value: WeatherStatus.WINDY,
    },
    [WeatherStatus.FOGGY]: {
      icon: <CloudFog className="h-4 w-4 text-blue-600" />,
      value: WeatherStatus.FOGGY,
    },
    [WeatherStatus.SNOWY]: {
      icon: <CloudSnow className="h-4 w-4 text-slate-300" />,
      value: WeatherStatus.SNOWY,
    },
    [WeatherStatus.STORMY]: {
      icon: <Tornado className="h-4 w-4 text-rose-500" />,
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
