"use client";

import { deleteCoefficientType } from "@/action/coefficient-types/delete-coefficient.api";
import type { ICoefficientTypeGroup } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteCoefficientType(buildingId: number) {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      const res = await deleteCoefficientType(id);
      if (!res.success || res._meta?.error) {
        throw new Error(res._meta?.error || "O'chirishda xatolik yuz berdi");
      }
    },
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<ICoefficientTypeGroup[]>(
        ["coefficient-types", buildingId],
        (old) => {
          if (!old) return old;

          return old.map((group) => ({
            ...group,
            bcts: group.bcts.filter((item) => item.id !== deletedId),
          }));
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["coefficient-types", buildingId]
      });
      
      toast.success("Тип коэффициента удален.");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}
