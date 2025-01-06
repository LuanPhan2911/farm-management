"use client";

import { StoreWithCrop } from "@/types";

import { Link } from "@/navigation";
import { SearchBar } from "@/components/search-bar";
import { useFormatter } from "next-intl";
import { NavPagination } from "@/components/nav-pagination";
import Image from "next/image";

interface ProductListProps {
  data: StoreWithCrop[];
  totalPage: number;
}
export const ProductList = ({ data, totalPage }: ProductListProps) => {
  return (
    <>
      <div className="my-4">
        <SearchBar
          isPagination
          placeholder={"Tìm kiểm nông sản theo tên"}
          inputClassName="bg-white"
          className="lg:w-[450px]"
        />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        {data.map((product) => {
          return <ProductItem data={product} key={product.id} />;
        })}
      </div>
      {!data.length && (
        <div className="my-4 text-muted-foreground flex justify-center">
          No results.
        </div>
      )}
      <div className="py-4">
        <NavPagination totalPage={totalPage} />
      </div>
    </>
  );
};
interface ProductItemProps {
  data: StoreWithCrop;
}
const ProductItem = ({ data }: ProductItemProps) => {
  const { number } = useFormatter();
  return (
    <Link
      className="lg:h-36 h-28 flex items-center bg-white border border-gray-200 rounded-lg shadow"
      href={`/products/detail/${data.id}`}
    >
      <div className="aspect-square relative lg:w-36 w-28 h-full">
        <Image
          src={data.imageUrl}
          alt={data.name}
          fill
          className="rounded-l-lg"
        />
      </div>
      <div className="flex flex-col lg:p-4 p-2 leading-normal">
        <h5
          className="mb-1 text-lg font-bold tracking-tight 
          text-green-500 dark:text-green-400 lg:line-clamp-2 line-clamp-1"
        >
          {data.name}
        </h5>
        <p className="mb-1 text-sm font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
          {data.address}
        </p>
        <h5 className="text-lg font-bold text-rose-500">
          {number(data.price, "currency")} / {data.unit.name}
        </h5>
      </div>
    </Link>
  );
};
