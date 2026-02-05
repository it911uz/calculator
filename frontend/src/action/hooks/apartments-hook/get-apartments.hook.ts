"use client"

import { getApartments } from "@/action/apartaments/get-apartaments.api";
import { QueryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export function useApartments(params: Record<string, number> = {}) {
 return useQuery({
   queryKey: [...QueryKeys.apartments.lists(), params],
    queryFn: () => getApartments(params),
  });
}