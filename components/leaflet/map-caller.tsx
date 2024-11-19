"use client";

import { LeafletMapProps } from "@/components/leaflet";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";

const LazyMap = dynamic(() => import("@/components/leaflet"), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-[400px]" />,
});

export const LeafletMapCaller = (props: LeafletMapProps) => {
  return <LazyMap {...props} />;
};
