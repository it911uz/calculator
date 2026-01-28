"use client";

import { getCoefficientTypesByBuildingId } from "@/api/coefficient-types/get-coefficient-type.api";
import { useQuery } from "@tanstack/react-query";

export function useCoefficientTypesByBuildingId(buildingId: number) {
  return useQuery({
    queryKey: ["coefficient-types", buildingId],
    queryFn: () => getCoefficientTypesByBuildingId(buildingId),
    enabled: !!buildingId,
  });
}