"use client";

import { deleteCoefficientType } from "@/api/coefficient-types/delete-coefficient.api";
import { ICoefficientTypeGroup } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteCoefficientType(buildingId: number) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: (id: number) => deleteCoefficientType(id),
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
      
      toast.success("Тип коэффициента удален.");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}