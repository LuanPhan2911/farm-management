export type PaginationData = {
  active?: boolean;
  page: number;
};

export const usePagination = (totalPage: number, currentPage: number) => {
  const data: PaginationData[] = [...Array(totalPage)].map((_, index) => {
    const page = index + 1;
    return {
      page,
      active: currentPage === page ? true : false,
    };
  });
  return { data };
};
