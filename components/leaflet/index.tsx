"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer } from "react-leaflet";
import { LatLngTuple, Map } from "leaflet";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  MyLocationButton,
  MyLocationMarker,
} from "./components/my-location-marker";
import { useLeafletMap } from "@/hooks/use-leaft-map";
import {
  CurrentLocationForm,
  CurrentLocationMarker,
} from "./components/current-location";
import { SearchLocation } from "./components/search-location";
import { ZoomInput } from "./components/zoom-input";
import { MarkerLocation } from "./components/marker-location";
import { useTranslations } from "next-intl";
import { FieldLocation } from "@/types";

export interface LeafletMapProps {
  className?: string;
  center?: LatLngTuple;
  zoom?: number;

  onChangeCurrentLocationFn?: (value: LatLngTuple) => void;
  onChangeLocationSelectFn?: (value: string) => void;

  markerLocations?: FieldLocation[];
}
const LeafletMap = ({
  className,
  zoom = 11,
  center = [10.38, 105.43],
  markerLocations,

  onChangeCurrentLocationFn,
  onChangeLocationSelectFn,
}: LeafletMapProps) => {
  const [map, setMap] = useState<Map | null>(null);
  const { currentPosition, myPosition, goToPosition, goToMyPosition } =
    useLeafletMap(map, center);
  const t = useTranslations("fields.other");

  useEffect(() => {
    if (currentPosition !== null && onChangeCurrentLocationFn) {
      onChangeCurrentLocationFn(currentPosition);
    }
  }, [currentPosition, onChangeCurrentLocationFn]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className={cn("w-full h-[400px]", className)}
      ref={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <div className="absolute left-2 top-20 z-[1000]">
        <ZoomInput defaultZoom={map?.getZoom() || undefined} />
      </div>

      <div className="absolute left-1 bottom-1 z-[1000]">
        <MyLocationButton goToMyPositionFn={goToMyPosition} />
      </div>
      <div className="absolute bottom-1 left-[50px] z-[1000]">
        <CurrentLocationForm
          currentPosition={currentPosition}
          goToPositionFn={goToPosition}
        />
      </div>
      <div className="absolute top-1 left-16 z-[1000]">
        <SearchLocation
          goToLocationFn={goToPosition}
          onChangeLocationSelectFn={onChangeLocationSelectFn}
        />
      </div>

      <MyLocationMarker position={myPosition} message={t("myLocation")} />
      <CurrentLocationMarker
        currentPosition={currentPosition}
        message={t("popupCreateLocation")}
      />
      {markerLocations?.map((item) => {
        return <MarkerLocation data={item} key={item.id} />;
      })}
    </MapContainer>
  );
};

export default LeafletMap;
