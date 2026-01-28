"use client";

import { updateCoefficient } from "@/api/coefficient/update-coefficients.api";
import { ICoefficient, QueryKeys } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateCoefficient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ICoefficient> }) =>
      updateCoefficient(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.coefficients.all });
      queryClient.invalidateQueries({ queryKey: QueryKeys.coefficients.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: QueryKeys.buildings.detail(data.building_id) });
    },
  });
}