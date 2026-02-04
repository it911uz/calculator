"use client";

import { getComplexes } from "@/action/complex/get-complexes.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useComplexes(params: Record<string, number> = {}) {
  return useQuery({
    queryKey: [...(QueryKeys.complex.lists() || ["complexes", "list"]), params],
    queryFn: () => getComplexes(params),
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, 
  });
}