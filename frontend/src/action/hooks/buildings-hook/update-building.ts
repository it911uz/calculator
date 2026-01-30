"use client";

import { updateBuilding } from "@/action/buildings/update-building.api";
import {  QueryKeys } from "@/types";
import type { IBuildings, UpdateBuildingArgs } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export function useUpdateBuilding() {
  const queryClient = useQueryClient();

  return useMutation<IBuildings, Error, UpdateBuildingArgs>({
    mutationFn: async ({ id, data }) => {
      const res = await updateBuilding(id, data);
      if (res._meta?.error) {
        throw new Error(res._meta.error);
      }
      if (!res.data) {
        throw new Error("Ma'lumot topilmadi");
      }
      return res.data;
    },

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