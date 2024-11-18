"use client";

import { SelectItemContentWithoutImage } from "@/components/form/select-item";
import { LatLngTuple } from "leaflet";
import { Marker, Popup } from "react-leaflet";

interface MarkerLocationProps {
  position?: LatLngTuple;
  title: string;
  description?: string | null;
}
export const MarkerLocation = ({
  description,
  position,
  title,
}: MarkerLocationProps) => {
  if (!position) {
    return null;
  }

  return (
    <Marker position={position}>
      <Popup>
        <SelectItemContentWithoutImage
          title={title}
          description={description}
        />
      </Popup>
    </Marker>
  );
};
