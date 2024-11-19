"use client";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { LatLngTuple } from "leaflet";
import { MapPin } from "lucide-react";
import { Marker, Popup } from "react-leaflet";

interface MyLocationMarkerProps {
  message?: string;
  position: LatLngTuple | null;
}

export const MyLocationMarker = ({
  message,
  position,
}: MyLocationMarkerProps) => {
  return position === null ? null : (
    <Marker position={position}>
      <Popup>{message || "You are here"}</Popup>
    </Marker>
  );
};

export const MyLocationButton = ({
  goToMyPositionFn,
}: {
  goToMyPositionFn: () => void;
}) => {
  return (
    <Hint asChild label="Go to my location">
      <Button variant={"outline"} size={"icon"} onClick={goToMyPositionFn}>
        <MapPin className="h-4 w-4" />
      </Button>
    </Hint>
  );
};
