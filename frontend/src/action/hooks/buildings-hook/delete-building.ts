"use client";

import { deleteBuilding } from "@/action/buildings/delete-building.api";
import { QueryKeys } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBuilding,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: QueryKeys.buildings.all });
      queryClient.removeQueries({ queryKey: QueryKeys.buildings.detail(id) });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Не удалось удалить здание");
    },
  });
}