"use client"

import { createApartment } from "@/api/apartaments/create-apartment.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateApartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createApartment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      if (data.building_id) {
        queryClient.invalidateQueries({ queryKey: ["buildings", "detail", data.building_id] });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Не удалось создать квартиру");
    },
  });
}