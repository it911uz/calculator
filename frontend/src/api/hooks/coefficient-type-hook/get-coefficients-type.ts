"use client";

import { getCoefficientTypes } from "@/api/coefficient-types/get-coefficient-types.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useCoefficientTypes() {
  return useQuery({
    queryKey: QueryKeys.coefficientTypes?.lists() || ["coefficientTypes", "list"],
    queryFn: getCoefficientTypes,
  });
}