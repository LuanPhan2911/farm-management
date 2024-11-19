"use client";

import { UserAvatar } from "@/components/user-avatar";
import { dateToString, getLocationLatLng } from "@/lib/utils";
import { FieldLocation } from "@/types";
import { useTranslations } from "next-intl";
import { Marker, Popup } from "react-leaflet";

interface MarkerLocationProps {
  data: FieldLocation;
}
export const MarkerLocation = ({ data }: MarkerLocationProps) => {
  const position = getLocationLatLng(data.latitude, data.longitude);
  if (!position) {
    return null;
  }
  const areaValue =
    data.area && data.unit?.name
      ? `${data.area} ${data.unit.name}`
      : "No area filled";

  const startDate = dateToString(data.latestCrop?.startDate) || "---";
  const endDate = dateToString(data.latestCrop?.endDate) || "---";

  return (
    <Marker position={position}>
      <Popup>
        <div className="flex items-center gap-x-2 w-[300px]">
          <UserAvatar
            src={data.latestCrop?.plant.name || undefined}
            className="rounded-full"
          />
          <div className="flex flex-col text-sm">
            <div className="font-semibold text-start">{data.name}</div>
            <div className="text-start">
              <span className="font-semibold">Area: </span>
              {areaValue}
            </div>
            <div className="text-start">
              <span className="font-semibold">Start: </span>
              {startDate}, <span className="font-semibold">Finish: </span>
              {endDate}
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-start my-2">
          {data.location}
        </div>
      </Popup>
    </Marker>
  );
};
