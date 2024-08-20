"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { usePathname, useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { PaginationArrow } from "./pagination-arrow";
import { usePagination } from "@/hooks/use-pagination";
import { Button } from "../ui/button";

interface NavPaginationProps {
  totalPage: number;
}
const ITEMS_TO_DISPLAY = 5;
export const NavPagination = ({ totalPage }: NavPaginationProps) => {
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;
  const router = useRouter();
  const pathname = usePathname();
  const { data: items } = usePagination(totalPage, currentPage);

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPage;
  const getPrevious = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${currentPage - 1}`);
    router.replace(`${pathname}?${params.toString()}`);
  };
  const getNext = () => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${currentPage + 1}`);
    router.replace(`${pathname}?${params.toString()}`);
  };
  const getPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", `${page}`);
    router.replace(`${pathname}?${params.toString()}`);
  };
  if (totalPage <= 1) {
    return null;
  }
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationArrow
            direction="left"
            isDisabled={!hasPrevious}
            onClick={getPrevious}
          />
        </PaginationItem>
        {items.length <= ITEMS_TO_DISPLAY &&
          items.map(({ page, active }) => {
            return (
              <PaginationItem key={page}>
                <Button
                  size={"icon"}
                  variant={active ? "purple" : "blue"}
                  onClick={() => getPage(page)}
                >
                  {page}
                </Button>
              </PaginationItem>
            );
          })}
        {items.length > ITEMS_TO_DISPLAY && (
          <>
            <PaginationItem>
              <Button
                size={"icon"}
                variant={items[0].active ? "purple" : "blue"}
                onClick={() => getPage(items[0].page)}
              >
                {items[0].page}
              </Button>
            </PaginationItem>
            {currentPage - 2 >= items[1].page && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            {items
              .slice(
                Math.max(currentPage - 2, 1),
                Math.min(currentPage + 1, items[items.length - 2].page)
              )
              .map(({ page, active }) => {
                return (
                  <PaginationItem key={page}>
                    <Button
                      size={"icon"}
                      variant={active ? "purple" : "blue"}
                      onClick={() => getPage(page)}
                    >
                      {page}
                    </Button>
                  </PaginationItem>
                );
              })}
            {currentPage + 2 < items[items.length - 1].page && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <Button
                size={"icon"}
                variant={items[items.length - 1].active ? "purple" : "blue"}
                onClick={() => getPage(items[items.length - 1].page)}
              >
                {items[items.length - 1].page}
              </Button>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationArrow
            direction="right"
            isDisabled={!hasNext}
            onClick={getNext}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
