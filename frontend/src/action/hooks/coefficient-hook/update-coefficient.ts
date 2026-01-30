"use client";

import { updateCoefficient } from "@/action/coefficient/update-coefficients.api";
import type { ICoefficient,  } from "@/types";
import {  QueryKeys } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateCoefficient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ICoefficient> }) => {
      const res = await updateCoefficient(id, data);
      
      if (res._meta?.error) {
        throw new Error(res._meta.error);
      }
      return res.data; 
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.coefficients.all });
      queryClient.invalidateQueries({ queryKey: QueryKeys.coefficients.detail(variables.id) });
      
      if (data?.building_id) {
        queryClient.invalidateQueries({ 
          queryKey: QueryKeys.buildings.detail(data.building_id) 
        });
      }

      toast.success("Koeffitsient muvaffaqiyatli yangilandi");
    },
    onError: (error) => {
      toast.error(error.message || "Yangilashda xatolik yuz berdi");
    }
  });
}