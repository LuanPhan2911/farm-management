"use client";

import { useQuery } from "@tanstack/react-query";

export const WeathersTableFacetedStatus = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs/select");
      return await res.json();
    },
  });
};
