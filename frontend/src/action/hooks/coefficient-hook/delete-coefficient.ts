"use client";

import { deleteCoefficient } from "@/action/coefficient/delete-coefficients.api";
import { QueryKeys } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteCoefficient(buildingId: number) { 
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCoefficient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.coefficients.all });
      queryClient.invalidateQueries({
        queryKey: ["coefficient-types", buildingId]
      });
      queryClient.invalidateQueries({ 
        queryKey: ["coefficients", "building", buildingId] 
      });
    },
  });
}