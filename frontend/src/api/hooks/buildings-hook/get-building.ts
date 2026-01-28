"use client";

import { getBuildingById } from "@/api/buildings/get-building.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useBuildingById(id: string | number | undefined) {
  return useQuery({
    queryKey: QueryKeys.buildings.detail(id as number | string),
    queryFn: () => getBuildingById(id!),
    enabled: !!id,
  });
}