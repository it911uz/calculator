"use client";

import { deleteCoefficientType } from "@/api/coefficient-types/delete-coefficient.api";
import { ICoefficientTypeGroup } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCoefficientType(buildingId: number) {
  const queryClient = useQueryClient();

  return useMutation<{ success: boolean }, Error,number>({
    mutationFn: deleteCoefficientType,
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<ICoefficientTypeGroup[]>(
        ["coefficient-types", buildingId],
        (old) => {
          if (!old) return old;

          return old.map((group) => ({
            ...group,
            bcts: group.bcts.filter(
              (item) => item.id !== deletedId
            ),
          }));
        }
      );
    },
  });
}