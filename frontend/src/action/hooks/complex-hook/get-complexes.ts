"use client";

import { getComplexes } from "@/action/complex/get-complexes.api";
import { QueryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useComplexes(params: Record<string, number> = {}) {
  return useQuery({
    queryKey: [...QueryKeys.complex.lists(), params],
    queryFn: () => getComplexes(params),
  
  });
}