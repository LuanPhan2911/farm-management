import { Staff } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import queryString from "query-string";

export const useCurrentStaff = () => {
  const { data, isError, isPending } = useQuery({
    queryKey: ["currentStaff"],
    queryFn: async () => {
      const url = queryString.stringifyUrl(
        {
          url: "/api/staffs/current",
        },
        {
          skipEmptyString: true,
        }
      );
      const res = await fetch(url);
      return (await res.json()) as Staff;
    },
  });
  if (isPending || isError) {
    return {
      currentStaff: null,
    };
  }
  return {
    currentStaff: data,
  };
};
