"use client";

import { LeafletMapCaller } from "@/components/leaflet/map-caller";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getLocationLatLng } from "@/lib/utils";
import { FieldLocationWithLatestCrop, Product } from "@/types";
import { Phone } from "lucide-react";
import { useFormatter } from "next-intl";
import Image from "next/image";

interface ProductDetailCardProps {
  data: Product;
}
export const ProductDetailCard = ({ data }: ProductDetailCardProps) => {
  const { number, dateTime } = useFormatter();
  const centerMap = getLocationLatLng(
    data.crop.field.latitude,
    data.crop.field.longitude
  );
  const { field, ...latestCrop } = data.crop;
  const fieldLocation: FieldLocationWithLatestCrop = {
    ...field,
    latestCrop,
  };
  return (
    <Card
      className="border-border/40 bg-background/95 
    backdrop-blur supports-[backdrop-filter]:bg-background/40 shadow-md"
    >
      <CardContent className="flex flex-col gap-4">
        <div className="grid lg:grid-cols-3 gap-x-8">
          <div className="relative aspect-video lg:col-span-2">
            <Image
              src={data.imageUrl}
              alt={data.name}
              fill
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <div className="text-sm text-muted-foreground dark:text-white font-semibold mt-4">
              &#62; {data.crop.plant.category.name}
            </div>
            <div className="font-bold text-green-400 text-lg line-clamp-2">
              {data.name}
            </div>
            <p>
              <span className="font-semibold">Giá bán lẻ: </span>{" "}
              <span className="text-xl text-rose-400 font-bold">
                {number(data.price, "currency")}/{data.unit.name}
              </span>
            </p>

            <p>
              <span className="font-semibold">Mùa vụ: </span> {data.crop.name}
            </p>
            <p>
              <span className="font-semibold">Ngày gieo trồng: </span>{" "}
              {dateTime(data.crop.startDate)}
            </p>
            <p>
              <span className="font-semibold">Địa chỉ: </span> {data.address}
            </p>
            <p className="font-semibold">Liên hệ đặt hàng tại số điện thoại </p>
            <div className="bg-green-500 flex items-center gap-2 p-4 justify-center text-white rounded-sm">
              <Phone />{" "}
              <span className="font-semibold">{data.phoneNumber}</span>
            </div>
          </div>
        </div>
        <Separator />
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <div className="text-lg font-semibold text-green-400">
              Mô tả sản phẩm
            </div>
            <p className="text-sm text-muted-foreground dark:text-white">
              {data.description}
            </p>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-400">Bản đồ</div>
            <p className="text-sm text-muted-foreground mb-2 dark:text-white">
              Vị trí đất canh tác trên bản đồ
            </p>
            <LeafletMapCaller
              className="h-[500px]"
              center={centerMap}
              markerLocations={[fieldLocation]}
              hiddenSearchLocation
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
