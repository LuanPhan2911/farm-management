"use client";

import { Link } from "@/navigation";
import { StoreWithCrop } from "@/types";
import { useFormatter } from "next-intl";
import Image from "next/image";

interface ProductGalleriesProps {
  data: StoreWithCrop[];
}
export const ProductGalleries = ({ data }: ProductGalleriesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {data.map((item) => {
        return <ProductItem data={item} key={item.id} />;
      })}
    </div>
  );
};

interface ProductItemProps {
  data: StoreWithCrop;
}
const ProductItem = ({ data }: ProductItemProps) => {
  const { number } = useFormatter();
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow dark:border-gray-700 mx-2">
      <Link href={`/products/detail/${data.id}`}>
        <div className="aspect-video relative">
          <Image
            src={data.imageUrl}
            alt={data.name}
            fill
            className="rounded-t-lg"
          />
        </div>
      </Link>
      <div className="p-3">
        <Link href={`/products/detail/${data.id}`}>
          <h5
            className="
          mb-2 text-lg font-bold tracking-tight 
          text-green-500 dark:text-green-400 line-clamp-2"
          >
            {data.name}
          </h5>
        </Link>
        <p className="mb-2 text-sm font-normal text-gray-700 dark:text-gray-400">
          {data.address}
        </p>
        <h5 className="text-lg font-bold text-center text-rose-500">
          {number(data.price, "currency")} / {data.unit.name}
        </h5>
      </div>
    </div>
  );
};
