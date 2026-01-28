"use client"
import { updateApartment } from "@/api/apartaments/update-apartment.api";
import { IApartment } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUpdateApartment() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<IApartment> }) =>
      updateApartment(id, data),

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["apartments"] });
      
      queryClient.setQueryData(["apartments", "detail", String(variables.id)], data);
      
      if (data.building_id) {
        queryClient.invalidateQueries({ queryKey: ["buildings", "detail", data.building_id] });
      }

      router.refresh(); 
    },
    onError: (error: Error) => {
      toast.error(error.message || "Не удалось обновить квартиру");
    },
  });
}