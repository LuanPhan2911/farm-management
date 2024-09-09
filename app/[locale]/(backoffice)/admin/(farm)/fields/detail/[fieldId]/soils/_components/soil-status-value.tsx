"use client";

import { SoilStatus } from "@prisma/client";
import {
  CloudFog,
  CloudRain,
  CloudSnow,
  Cloudy,
  SunDim,
  Tornado,
  Wind,
} from "lucide-react";

interface SoilStatusValueProps {
  status: SoilStatus;
}
export const SoilStatusValue = ({ status }: SoilStatusValueProps) => {
  const options = {
    [SoilStatus.SUNNY]: {
      icon: <SunDim className="h-6 w-6 text-yellow-300" />,
      value: SoilStatus.SUNNY,
    },
    [SoilStatus.CLOUDY]: {
      icon: <Cloudy className="h-6 w-6 text-sky-400" />,
      value: SoilStatus.CLOUDY,
    },
    [SoilStatus.RAINY]: {
      icon: <CloudRain className="h-6 w-6 text-slate-500" />,
      value: SoilStatus.RAINY,
    },
    [SoilStatus.WINDY]: {
      icon: <Wind className="h-6 w-6 text-green-400" />,
      value: SoilStatus.WINDY,
    },
    [SoilStatus.FOGGY]: {
      icon: <CloudFog className="h-6 w-6 text-blue-600" />,
      value: SoilStatus.FOGGY,
    },
    [SoilStatus.SNOWY]: {
      icon: <CloudSnow className="h-6 w-6 text-slate-300" />,
      value: SoilStatus.SNOWY,
    },
    [SoilStatus.STORMY]: {
      icon: <Tornado className="h-6 w-6 text-rose-500" />,
      value: SoilStatus.STORMY,
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
