"use client";

import { getCoefficientById } from "@/api/coefficient/get-coefficient.api";
import { getCoefficients } from "@/api/coefficient/get-coefficients.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useCoefficients() {
  return useQuery({
    queryKey: QueryKeys.coefficients.lists(),
    queryFn: getCoefficients,
  });
}

export function useCoefficient(id: number) {
  return useQuery({
    queryKey: QueryKeys.coefficients.detail(id),
    queryFn: () => getCoefficientById(id),
    enabled: !!id,
  });
}