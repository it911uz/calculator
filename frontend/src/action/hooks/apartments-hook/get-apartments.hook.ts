"use client";

import { useQuery } from "@tanstack/react-query";
import { getApartments } from "@/action/apartaments/get-apartaments.api";
import { QueryKeys } from "@/lib/query-keys";

export function useApartments(params: Record<string, number> = {}) {
    return useQuery({
        queryKey: [...QueryKeys.apartments.lists(), params],
        queryFn: () => getApartments(params),
    });
}
