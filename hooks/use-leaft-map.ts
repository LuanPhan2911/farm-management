import { getLatLng } from "@/lib/utils";
import { LatLngTuple, Map } from "leaflet";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";

export const useLeafletMap = (map: Map | null, center?: LatLngTuple | null) => {
  const [myPosition, setMyPosition] = useState<LatLngTuple | null>(null);
  const [currentPosition, setCurrentPosition] = useState<LatLngTuple | null>(
    () => {
      return center ?? null;
    }
  );

  const goToMyPosition = () => {
    if (!map) {
      return;
    }
    map
      .locate()
      .addEventListener("locationfound", (e) => {
        setMyPosition(getLatLng(e.latlng.lat, e.latlng.lng));
        map.flyTo(e.latlng, map.getZoom());
      })
      .addEventListener("locationerror", () => {
        toast.error("Cannot find your location");
      });
  };

  const goToPosition = (position: LatLngTuple, zoom?: number) => {
    if (!map) {
      return;
    }
    map.flyTo(position, zoom ?? map.getZoom());
  };

  const handleChangeCurrentPosition = useDebounceCallback(
    (value: LatLngTuple) => {
      setCurrentPosition(value);
    },
    100
  );
  const onMove = useCallback(() => {
    if (!map) {
      return;
    }
    const { lat, lng } = map.getCenter();
    handleChangeCurrentPosition(getLatLng(lat, lng));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }
    map.on("move", onMove);

    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  return {
    myPosition,
    currentPosition,
    goToMyPosition,
    goToPosition,
  };
};
