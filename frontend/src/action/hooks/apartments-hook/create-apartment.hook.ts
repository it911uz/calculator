"use client"

import { createApartment } from "@/action/apartaments/create-apartment.api";
import type { IApartment } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateApartment() {
  const queryClient = useQueryClient();
  return useMutation<IApartment, Error, Partial<IApartment>>({
    mutationFn: async (payload) => {
      const res = await createApartment(payload);
      if (res._meta?.error) {
        throw new Error(res._meta.error);
      }
      if (!res.data) {
        throw new Error("Ma'lumot topilmadi");
      }
      
      return res.data; 
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      
      if (data.building_id) {
        queryClient.invalidateQueries({ 
          queryKey: ["buildings", "detail", data.building_id] 
        });
      }
      
      toast.success("Квартира успешно создана");
    },
    onError: (error) => {
      toast.error(error.message || "Не удалось создать квартиру");
    },
  });
}