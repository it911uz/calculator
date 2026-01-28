"use client";

import { getComplexById } from "@/api/complex/get-complex.api";
import { IComplex } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useComplexById(id?: string | number) {
  return useQuery<IComplex>({
    queryKey: ["complex", id],
    queryFn: () => getComplexById(id as string),
    enabled: !!id, 
  });
}