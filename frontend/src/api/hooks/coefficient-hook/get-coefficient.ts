"use client";

import { getCoefficientById } from "@/api/coefficient/get-coefficient.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useCoefficient(id: number) {
  return useQuery({
    queryKey: QueryKeys.coefficients.detail(id),
    queryFn: () => getCoefficientById(id),
    enabled: !!id,
  });
}