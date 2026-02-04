"use client";

import { getBuildings } from "@/action/buildings/get-buildings.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useBuildings(filters: { search?: string; page?: number } = {}) {
    return useQuery({
    queryKey: [QueryKeys.buildings.list, filters],
    queryFn: () => getBuildings(filters),
    enabled: true,
  });
}