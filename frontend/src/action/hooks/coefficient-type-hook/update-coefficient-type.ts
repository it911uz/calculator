"use client";

import { updateCoefficientType } from "@/action/coefficient-types/update-coefficcient.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateCoefficientType(buildingId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      coefficientTypeId,
      name,
      rate,
      coefficient_id, 
    }: {
      coefficientTypeId: number;
      name: string;
      rate: string | number;
      coefficient_id: number;
    }) =>
      updateCoefficientType(coefficientTypeId, {
        name,
        rate,
        coefficient_id,
      }),

    onSuccess: (data, variables) => {
      toast.success("Обновлено успешно");
      queryClient.invalidateQueries({
        queryKey: ["coefficient-types", buildingId],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message || "Не удалось обновить тип коэффициента",);
    },
  });
}