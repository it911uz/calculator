"use client"

import { getBuildingsByComplexId } from "@/api/buildings/get-building-by-complexes.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useBuildingsByComplex(complexId: string | number | undefined) {
  return useQuery({
    queryKey: [...QueryKeys.buildings.all, "complex", complexId],
    queryFn: () => getBuildingsByComplexId(complexId!),
    enabled: !!complexId,
  });
}