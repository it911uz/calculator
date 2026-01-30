"use client"
import { getApartmentById } from "@/action/apartaments/get-apartament.api";
import { QueryKeys } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useApartmentById(id: number) {
  return useQuery({
    queryKey: QueryKeys.apartments?.detail(id) || ["apartments", "detail", id],
    queryFn: () => getApartmentById(id),
    enabled: !!id,
  });
}