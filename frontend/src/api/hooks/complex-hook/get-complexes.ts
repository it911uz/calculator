"use client";

import { getComplexes } from "@/api/complex/get-complexes.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useComplexes() {
  return useQuery({
    queryKey: QueryKeys.complex.lists(),
    queryFn: getComplexes,
    retry: 1,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, 
  });
}