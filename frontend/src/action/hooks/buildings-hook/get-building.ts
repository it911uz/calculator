"use client";

import { getBuildingById } from "@/action/buildings/get-building.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useBuildingById(
  id: string | number | undefined, 
  params: Record<string, unknown> = {}
) {
  return useQuery({
    queryKey: [...(QueryKeys.buildings.detail(id as number | string) || ["buildings", "detail", id]), params],
    queryFn: () => getBuildingById(id!, params),
    enabled: !!id,
    retry: 1,
  });
}