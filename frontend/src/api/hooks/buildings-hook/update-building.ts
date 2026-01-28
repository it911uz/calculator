"use client";

import { updateBuilding } from "@/api/buildings/update-building.api";
import { IBuildings, QueryKeys } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateBuilding() {
  const queryClient = useQueryClient();

  return useMutation<
    IBuildings, 
    Error,      
    { id: string | number; data: Partial<IBuildings> }
  >({
    mutationFn: ({ id, data }) => updateBuilding(id, data),

    onSuccess: (data, variables) => {
      toast.success("Здание обновлено");
      
      queryClient.invalidateQueries({ queryKey: QueryKeys.buildings.all });

      queryClient.setQueryData(QueryKeys.buildings.detail(variables.id), data);

      if (data.complex_id) {
        queryClient.invalidateQueries({
          queryKey: [...QueryKeys.buildings.all, "complex", data.complex_id],
        });
      }
    },

    onError: (error) => {
      toast.error(error.message || "Ошибка при обновлении здания");
    },
  });
}