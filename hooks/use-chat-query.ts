import { useSocket } from "@/stores/use-socket";
import { MessageWithStaff, PaginatedWithCursorResponse } from "@/types";

import { useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
export type ChatParamKey = "orgId";
interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey?: ChatParamKey;
  paramValue?: string;
}

export const useChatQuery = ({
  apiUrl,
  paramKey,
  paramValue,
  queryKey,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({
    pageParam = undefined,
  }: {
    pageParam?: string | null | number;
  }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          ...(paramKey &&
            paramValue && {
              [paramKey]: paramValue,
            }),
        },
      },
      {
        skipNull: true,
      }
    );
    const res = await fetch(url);

    return (await res.json()) as PaginatedWithCursorResponse<MessageWithStaff>;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: [queryKey],
    queryFn: fetchMessages,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    initialPageParam: undefined,
    refetchInterval: isConnected ? false : 1000,
  });
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  };
};
