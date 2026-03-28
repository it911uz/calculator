"use client";

import { useQuery } from "@tanstack/react-query";
import { getBuildings } from "@/action/buildings/get-buildings.api";
import { QueryKeys } from "@/lib/query-keys";

export function useBuildings(filters: { search?: string; page?: number } = {}) {
    return useQuery({
        queryKey: [QueryKeys.buildings.list, filters],
        queryFn: () => getBuildings(filters),
    });
}
