"use client";

import { getBuildings } from "@/api/buildings/get-buildings.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useBuildings() {
  return useQuery({
    queryKey: QueryKeys.buildings.lists(),
    queryFn: getBuildings,
  });
}