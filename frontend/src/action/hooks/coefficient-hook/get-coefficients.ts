"use client";

import { getCoefficients } from "@/action/coefficient/get-coefficients.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useCoefficients() {
  return useQuery({
    queryKey: QueryKeys.coefficients.lists(),
    queryFn: getCoefficients,
  });
}

