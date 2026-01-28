"use client";

import { createCoefficient } from "@/api/coefficient/create-coefficients.api";
import { CreateCoefficientPayload, ICoefficient } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateCoefficient() {
  const queryClient = useQueryClient();
  return useMutation<ICoefficient, Error, CreateCoefficientPayload>({
    mutationFn: createCoefficient,
    onSuccess: (newCoefficient) => {
      queryClient.invalidateQueries({ queryKey: ["coefficients"] });
      queryClient.invalidateQueries({ 
        queryKey: ["coefficients", "building", newCoefficient.building_id] 
      });
      queryClient.invalidateQueries({
        queryKey: ["coefficient-types", newCoefficient.building_id]
      });
    },
  });
}