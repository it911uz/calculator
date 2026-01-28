"use client"

import { getApartments } from "@/api/apartaments/get-apartaments.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useApartments() {
  return useQuery({
    queryKey: QueryKeys.apartments?.lists() || ["apartments", "list"],
    queryFn: getApartments,
  });
}