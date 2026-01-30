"use client"

import { deleteApartment } from "@/action/apartaments/delete-apartment.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteApartment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteApartment,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      queryClient.removeQueries({ queryKey: ["apartments", "detail", id] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Не удалось удалить квартиру");
    },
  });
}