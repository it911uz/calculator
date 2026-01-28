"use client";

import { createBuilding } from "@/api/buildings/create-building.api";
import { QueryKeys } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBuilding,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.buildings.all });
      if (data.complex_id) {
        queryClient.invalidateQueries({
          queryKey: [...QueryKeys.buildings.all, "complex", data.complex_id],
        });
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create building");
    },
  });
}